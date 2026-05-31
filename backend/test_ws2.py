import asyncio
import websockets
import json

async def test_ws_simple():
    uri = 'ws://localhost:8000/ws/code/execute'
    print(f'Connecting to {uri}...')
    async with websockets.connect(uri) as ws:
        # 最简单的 Python 代码（无交互）
        await ws.send(json.dumps({
            'action': 'execute',
            'code': 'print("Hello WS!")\nprint("Line 2")\nprint("Done")',
            'language': 'python',
            'timeout': 10
        }))
        print('Sent execute message')

        for i in range(20):
            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=2)
                msg = json.loads(raw)
                print(f'  msg[{i}]: type={msg["type"]} data={repr(msg.get("data",""))[:80]}')
                if msg['type'] == 'exit':
                    break
            except asyncio.TimeoutError:
                print('  [TIMEOUT after waiting]')
                break

asyncio.run(test_ws_simple())
