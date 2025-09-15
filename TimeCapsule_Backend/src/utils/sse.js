import * as store from '../models/capsules.store.js';

const clients = new Set();
let keepAliveTimer = null;
let scheduler = null;
const announced = new Set();

function send(res, event, data) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  res.write(`event: ${event}\n`);
  res.write(`data: ${payload}\n\n`);
}

export function subscribe(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();

  send(res, 'hello', { message: 'connected' });
  clients.add(res);

  if (!keepAliveTimer) {
    keepAliveTimer = setInterval(() => {
      for (const c of clients) {
        try { c.write(': keep-alive\n\n'); } catch {}
      }
    }, 15000);
  }

  startScheduler();

  req.on('close', () => {
    clients.delete(res);
    if (clients.size === 0) {
      if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
      if (scheduler) { clearInterval(scheduler); scheduler = null; }
    }
  });
}

function startScheduler() {
  if (scheduler) return;
  scheduler = setInterval(() => {
    const { data } = store.list({ status: 'unlocked', page: 1, limit: 1000 });
    for (const c of data) {
      if (!announced.has(c.id)) {
        announced.add(c.id);
        for (const client of clients) {
          try { send(client, 'unlocked', { id: c.id, title: c.title, unlockAt: c.unlockAt }); } catch {}
        }
      }
    }
  }, 2000);
}
