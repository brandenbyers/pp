#!/bin/bash

# Terminate http-server
kill $(lsof -t -i :8080)

# Terminate ngrok
kill $(lsof -t -i :4040)
