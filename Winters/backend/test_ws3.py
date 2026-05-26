import asyncio
import websockets
import json

async def test_ws_interactive():
    uri = 'ws://localhost:8000/ws/code/execute'
    print('Connecting...')
    async with websockets.connect(uri) as ws:
        code = 'name = input("Enter name: ")\nprint(f"Hello, {name}!")\nprint("Bye!")'
        await ws.send(json.dumps({'action': 'execute', 'code': code, 'language': 'python', 'timeout': 15}))
        print('Sent execute (with input)')

        received_output = False
        for i in range(10):
            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=3)
                msg = json.loads(raw)
                t = msg['type']
                d = repr(msg.get('data', ''))[:100]
                print(f'  [RECV] type={t} data={d}')
                received_output = True
                if t == 'exit':
                    return
            except asyncio.TimeoutError:
                break

        if not received_output:
            print('  No output received!')
            return

        inp = json.dumps({'action': 'input', 'data': 'Alice\n'})
        print(f'  Sending input: {inp}')
        await ws.send(inp)

        for i in range(10):
            try:
                raw = await asyncio.wait_for(ws.recv(), timeout=5)
                msg = json.loads(raw)
                t = msg['type']
                d = repr(msg.get('data', ''))[:100]
                print(f'  [RECV] type={t} data={d}')
                if t == 'exit':
                    break
            except asyncio.TimeoutError:
                print('  [TIMEOUT]')
                break

asyncio.run(test_ws_interactive())
