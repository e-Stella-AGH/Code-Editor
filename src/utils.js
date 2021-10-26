export const decodeFile = (encoded) => {
  return Buffer.from(encoded, 'base64').toString('ascii')
}

export const submit = (link, code, language, tests, solverId, taskId) => {
  return fetch(`${link}/with_tests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      solverId: solverId,
      taskId: taskId,
      code: code,
      language: language,
      tests: {
        fileName: 'tests.json',
        fileBase64: tests
      },
      testsType: 'file'
    })
  }).then((response) => response.json())
}
