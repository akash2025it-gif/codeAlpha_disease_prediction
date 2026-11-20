import urllib.parse

def simulate_middleware(scope):
    qs = scope.get("query_string", b"").decode("utf-8", errors="ignore")
    if "__path=" in qs:
        params = urllib.parse.parse_qs(qs)
        if "__path" in params and params["__path"]:
            target_path = params["__path"][0]
            if not target_path.startswith("/"):
                target_path = "/" + target_path
            # Strip trailing slash if not root
            if len(target_path) > 1 and target_path.endswith("/"):
                target_path = target_path.rstrip("/")
            scope["path"] = target_path
            scope["raw_path"] = target_path.encode("utf-8")
            
            cleaned_params = {k: v for k, v in params.items() if k != "__path"}
            new_qs = urllib.parse.urlencode(cleaned_params, doseq=True).encode("utf-8")
            scope["query_string"] = new_qs

# Test Case 1: /health
s1 = {"path": "/api/index.py", "query_string": b"__path=/health"}
simulate_middleware(s1)
assert s1["path"] == "/health"
assert s1["query_string"] == b""

# Test Case 2: /auth/login
s2 = {"path": "/api/index.py", "query_string": b"__path=auth/login"}
simulate_middleware(s2)
assert s2["path"] == "/auth/login"

# Test Case 3: /predict/heart
s3 = {"path": "/api/index.py", "query_string": b"__path=/predict/heart"}
simulate_middleware(s3)
assert s3["path"] == "/predict/heart"

# Test Case 4: / with extra client query params
s4 = {"path": "/api/index.py", "query_string": b"__path=/&filter=active"}
simulate_middleware(s4)
assert s4["path"] == "/"
assert s4["query_string"] == b"filter=active"

print("All query rewrite tests passed successfully!")
