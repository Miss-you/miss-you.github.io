{{- $canonical := (.OutputFormats.Get "HTML").Permalink -}}
# {{ .Title }}

{{ with partial "author.html" . -}}
- Author: {{ . }}
{{ end -}}
- Published: {{ .PublishDate.Format "2006-01-02" }}
- Updated: {{ .Lastmod.Format "2006-01-02" }}
- Language: {{ .Lang }}
- Original: {{ $canonical }}

{{ strings.TrimPrefix "\n" .RawContent -}}
