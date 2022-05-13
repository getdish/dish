import './mapkit.vendor'

const tokens = {
  'dishapp.com':
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVWNzU5QzkzWDIifQ.eyJpc3MiOiIzOTlXWThYOUhZIiwiaWF0IjoxNjMyNjAwMzc3LCJleHAiOjE2NjM4OTEyMDAsIm9yaWdpbiI6Imh0dHBzOi8vZGlzaGFwcC5jb20ifQ.BH2rhXUEsAO_g27M0cpkY2xDsfAOw2ncMZ0NkkRtWghO6Q7YkXGtjhAwu8TRhUyxrSuMJqiJ06aoHftnmfMeIA',
  'live.dish.localhost':
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVWNzU5QzkzWDIifQ.eyJpc3MiOiIzOTlXWThYOUhZIiwiaWF0IjoxNjMyNjAxNDUzLCJleHAiOjE2NjM4OTEyMDAsIm9yaWdpbiI6Imh0dHA6Ly9kMWxpdmUuY29tIn0.Nub6s3hYL49e6aUilShu7zbMW30hfUrgmpOHAb2ZZmkLxhk3gqGD_oUavi4dff-A1FUC46u5ureMBDz0Htlkjg',
  'dish.localhost':
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVWNzU5QzkzWDIifQ.eyJpc3MiOiIzOTlXWThYOUhZIiwiaWF0IjoxNjMyNjAxNTE1LCJleHAiOjE2NjM4OTEyMDAsIm9yaWdpbiI6Imh0dHA6Ly9kMXNoLmNvbSJ9.b3v2rrJycEpKZDrTPP--hamAh9d0dW1Gxe2_px3WpytFuN8FMHkLRfAzyX3GA-t54Jmje80atofS1RzUWyqh1Q',
}

const token = tokens[location.host]

// @ts-ignore
mapkit.init({
  authorizationCallback: function (done) {
    done(token)
  },
})

// @ts-ignore
export const MapKit = mapkit
