#!/bin/bash

kubectl rollout restart deployment auth-deployment
kubectl rollout restart deployment storage-deployment
kubectl rollout restart deployment hr-deployment
kubectl rollout restart deployment nginx-deployment