import functions_framework

MOCK_DB = {
    "myocardial infarction": {
        "definition": "A blockage of blood flow to the heart muscle. (Heart Attack)",
        "translation_es": "infarto de miocardio"
    },
    "aspirin": {
        "definition": "A medication used to reduce pain, fever, or inflammation.",
        "translation_es": "aspirina"
    }
}

@functions_framework.http
def terminology_lookup(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # The term is expected as a query parameter, e.g., ?term=aspirin
    term = request.args.get("term", "").lower()

    if not term:
        return ("No term provided.", 400, headers)

    if term in MOCK_DB:
        return (MOCK_DB[term], 200, headers)
    else:
        return ({"error": "Term not found"}, 404, headers)
