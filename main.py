import socket, os

# get IPv4
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
myIPv4 = s.getsockname()[0]

# input atemip
atemIP = input("Inserire indirizzo IP Atem: ")

# update .env
file = open('.env', 'w')
file.write("ATEM_IP=" + atemIP + "\n")
file.write("STREAMING_URL=webrtc://" + myIPv4 + "/live/livestream")
file.close()

# launch 
os.system("node index.js")