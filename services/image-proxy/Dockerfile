FROM h2non/imaginary

ENV PORT "8080"

CMD [ \
  "-enable-url-source", \
  "-http-read-timeout" ,"3" \
  "-allowed-origins", "https://dish-images.sfo2.digitaloceanspaces.com" \
  "-enable-placeholder" \
]
