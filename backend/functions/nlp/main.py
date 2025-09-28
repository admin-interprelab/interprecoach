import functions_framework

@functions_framework.http
def nlp_analysis(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    text = request_json.get("text") if request_json else None

    if not text:
        return ("No text provided.", 400, headers)

    print(f"Analyzing text: {text}")
    
    # In a real implementation, this would call the Natural Language API.
    # For this placeholder, we return a mock response.
    mock_entities = []
    if "myocardial infarction" in text.lower():
        mock_entities.append("myocardial infarction")
    if "aspirin" in text.lower():
        mock_entities.append("aspirin")

    return ({"entities": mock_entities}, 200, headers)
