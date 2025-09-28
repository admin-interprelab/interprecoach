import functions_framework

@functions_framework.http
def qa_feedback(request):
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
    transcript = request_json.get("transcript", "") if request_json else ""

    print(f"Generating QA feedback for transcript: {transcript[:150]}...")
    
    # This placeholder returns a mock QA report.
    feedback = "The interpretation was clear and accurate. Consider speaking slightly slower when complex medical terms are used."
    return ({"qa_report": feedback}, 200, headers)
