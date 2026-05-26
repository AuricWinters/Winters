import asyncio
import websockets
import json

async def test():
    uri = 'ws://localhost:8000/ws/code/execute'
    async with websockets.connect(uri, open_timeout=5) as ws:
        code = "import sys\nsys.stdout.write('start\\n')\nsys.stdout.flush()\nname=sys.stdin.readline()\nsys.stdout.write('got: '+name)"
        await ws.send(json.dumps({'action': 'execute', 'code': code, 'language': 'python', 'timeout': 10}))
        print('Sent')
        for i in range(15):
            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=2)
                msg = json.loads(raw)
                t = msg['type']
                d = repr(msg.get('data', ''))[:80]
                print(f'  [{t}] {d}')
            except asyncio.TimeoutError:
                if i == 0:
                    inp = json.dumps({'action': 'input', 'data': 'TestUser' + chr(10)})
                    print(f'  Sending input...')
                    await ws.send(inp)
                else:
                    print('  [TIMEOUT]')
                    break

asyncio.run(test())
