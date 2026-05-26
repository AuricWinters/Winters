import asyncio
import websockets
import json

async def test_ws():
    uri = 'ws://localhost:8000/ws/code/execute'
    print(f'Connecting to {uri}...')
    async with websockets.connect(uri) as ws:
        # Test 1: Python with input()
        code = '''name = input("Enter your name: ")
print(f"Hello, {name}!")
for i in range(3):
    print(f"Count: {i+1}")
'''
        await ws.send(json.dumps({'action': 'execute', 'code': code, 'language': 'python', 'timeout': 15}))
        print('Sent execute message (Python with input)')

        output_count = 0
        while True:
            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=10)
                msg = json.loads(raw)
                if msg['type'] == 'output':
                    print(f'  [OUT] {msg["data"]}', end='')
                    output_count += 1
                elif msg['type'] == 'error':
                    print(f'  [ERR] {msg["data"]}', end='')
                elif msg['type'] == 'exit':
                    print(f'\n  [EXIT] code={msg["code"]}')
                    break
            except asyncio.TimeoutError:
                print('  [TIMEOUT]')
                break

asyncio.run(test_ws())
