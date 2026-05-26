import asyncio
import websockets
import json

async def test():
    uri = 'ws://localhost:8000/ws/code/execute'
    ws = await websockets.connect(uri, open_timeout=10)
    print('Connected!')

    code = "import sys\nsys.stdout.write('start\\n')\nsys.stdout.flush()\nname=sys.stdin.readline()\nsys.stdout.write('got: '+name)"
    await ws.send(json.dumps({'action': 'execute', 'code': code, 'language': 'python', 'timeout': 10}))
    print('Sent execute')

    msg = await asyncio.wait_for(ws.recv(), timeout=5)
    print(f'Got: {json.loads(msg)}')

    print('Sending input now...')
    await ws.send(json.dumps({'action': 'input', 'data': 'TestUser' + chr(10)}))
    print('Input sent!')

    msg = await asyncio.wait_for(ws.recv(), timeout=5)
    print(f'Got after input: {json.loads(msg)}')

    msg = await asyncio.wait_for(ws.recv(), timeout=5)
    print(f'Got final: {json.loads(msg)}')

    await ws.close()
    print('Done')

asyncio.run(test())
