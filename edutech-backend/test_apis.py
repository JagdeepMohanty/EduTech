#!/usr/bin/env python3
"""
EduTech API Testing Script
Tests all API endpoints to ensure they're working correctly
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, headers=None, data=None, expected_status=200):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        if response.status_code == expected_status:
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            return response.json() if response.content else None
        else:
            print(f"❌ {method} {endpoint} - Expected: {expected_status}, Got: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return None

def run_api_tests():
    """Run comprehensive API tests"""
    print("🚀 Starting EduTech API Tests...\n")
    
    # Test server status
    print("📡 Testing Server Status:")
    test_endpoint("GET", "/")
    test_endpoint("GET", "/health")
    print()
    
    # Test authentication
    print("🔐 Testing Authentication:")
    
    # Register a test user
    register_data = {
        "username": "apitest",
        "email": "apitest@example.com",
        "password": "testpass123"
    }
    user_response = test_endpoint("POST", "/auth/register", data=register_data, expected_status=201)
    
    # Login
    login_data = {
        "email": "apitest@example.com",
        "password": "testpass123"
    }
    login_response = test_endpoint("POST", "/auth/login", data=login_data)
    
    if not login_response or 'access_token' not in login_response:
        print("❌ Failed to get access token. Stopping tests.")
        return False
    
    token = login_response['access_token']
    auth_headers = {"Authorization": f"Bearer {token}"}
    
    # Test current user
    test_endpoint("GET", "/auth/me", headers=auth_headers)
    print()
    
    # Test quizzes
    print("📚 Testing Quiz APIs:")
    test_endpoint("GET", "/quizzes")
    test_endpoint("GET", "/quizzes?subject=Science")
    
    # Get a quiz ID for testing
    quizzes_response = test_endpoint("GET", "/quizzes")
    if quizzes_response and len(quizzes_response) > 0:
        quiz_id = quizzes_response[0]['id']
        test_endpoint("GET", f"/quizzes/{quiz_id}")
        
        # Test quiz attempt
        attempt_data = {"answers": [0, 1, 2]}
        test_endpoint("POST", f"/quizzes/{quiz_id}/attempt", headers=auth_headers, data=attempt_data)
    print()
    
    # Test chatbot
    print("🤖 Testing Chatbot APIs:")
    chat_data = {"message": "Hello, I need help with studying"}
    test_endpoint("POST", "/chatbot/chat", headers=auth_headers, data=chat_data)
    test_endpoint("GET", "/chatbot/conversations", headers=auth_headers)
    print()
    
    # Test summarization
    print("📝 Testing Summarization APIs:")
    summary_data = {
        "text": "This is a test text for summarization. It contains multiple sentences to test the summarization functionality. The system should be able to create a shorter version of this text while maintaining the key information."
    }
    test_endpoint("POST", "/summarization/summarize", headers=auth_headers, data=summary_data)
    test_endpoint("GET", "/summarization/summaries", headers=auth_headers)
    print()
    
    # Test progress
    print("📊 Testing Progress APIs:")
    test_endpoint("GET", "/progress/dashboard", headers=auth_headers)
    print()
    
    # Test feedback
    print("💬 Testing Feedback APIs:")
    feedback_data = {
        "rating": 5,
        "category": "general",
        "message": "Great API testing!",
        "subject": "Testing"
    }
    test_endpoint("POST", "/feedback/submit", headers=auth_headers, data=feedback_data, expected_status=201)
    test_endpoint("GET", "/feedback/my-feedback", headers=auth_headers)
    print()
    
    # Test error handling
    print("🔒 Testing Error Handling:")
    test_endpoint("GET", "/quizzes/invalid_id", expected_status=400)
    test_endpoint("GET", "/auth/me", expected_status=401)  # No auth header
    print()
    
    print("✅ All API tests completed!")
    return True

if __name__ == "__main__":
    try:
        success = run_api_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Test suite failed: {str(e)}")
        sys.exit(1)