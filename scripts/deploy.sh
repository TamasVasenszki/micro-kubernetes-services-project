#!/bin/bash

echo "Applying secrets..."
kubectl apply -f k8s/secrets.yaml

echo "Applying databases..."
kubectl apply -f k8s/auth-db.yaml
kubectl apply -f k8s/storage-db.yaml
kubectl apply -f k8s/hr-db.yaml

echo "Applying services..."
kubectl apply -f k8s/auth.yaml
kubectl apply -f k8s/storage.yaml
kubectl apply -f k8s/hr.yaml

echo "Applying nginx..."
kubectl apply -f k8s/nginx-configmap.yaml
kubectl apply -f k8s/nginx.yaml

echo "Applying HPA..."
kubectl apply -f k8s/auth-hpa.yaml
kubectl apply -f k8s/storage-hpa.yaml
kubectl apply -f k8s/hr-hpa.yaml
kubectl apply -f k8s/nginx-hpa.yaml

echo "Deployment complete!"