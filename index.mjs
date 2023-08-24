export const handler = function (event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var headers = event.headers;
  var queryStringParameters = event.queryStringParameters;
  var pathParameters = event.pathParameters;
  var stageVariables = event.stageVariables;

  var resource = event.routeArn; // root resource
  var authResponse = {};
  var condition = {};
  condition.IpAddress = {};

  if (headers.authorization === "mysupersecretkey") {
    callback(null, generateAllow('me', resource));
  } else {
    callback("Unauthorized");
  }
}

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
  // Required output:
  var authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {

    var policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    "stringKey": "stringval",
    "numberKey": 123,
    "booleanKey": true
  };

  return authResponse;
}

var generateAllow = function (principalId, resource) {
  return generatePolicy(principalId, 'Allow', resource);
}

var generateDeny = function (principalId, resource) {
  return generatePolicy(principalId, 'Deny', resource);
}
