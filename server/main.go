package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"

	b64 "encoding/base64"

	"oss.terrastruct.com/d2/d2compiler"
	"oss.terrastruct.com/d2/d2exporter"
	"oss.terrastruct.com/d2/d2layouts/d2dagrelayout"
	"oss.terrastruct.com/d2/d2renderers/d2svg"
	"oss.terrastruct.com/d2/lib/textmeasure"
)

func render(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	ctx := context.Background()
	script := r.URL.Query().Get("script")
	scriptBytes := bytes.NewBufferString(script)
	data, err := getGraphSVG(ctx, scriptBytes, &d2svg.RenderOpts{})
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	base64 := b64.StdEncoding.EncodeToString([]byte(data))
	io.WriteString(w, base64)
}

func main() {
	port := 8000

	http.HandleFunc("/render", render)

	fmt.Printf("Starting server on port %v\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("Server closed\n")
	} else if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
		os.Exit(1)
	}
}

func getGraphSVG(ctx context.Context, buf *bytes.Buffer, opts *d2svg.RenderOpts) ([]byte, error) {
	graph, _, err := d2compiler.Compile("", buf, &d2compiler.CompileOptions{UTF16Pos: true})
	if err != nil {
		return nil, err
	}

	ruler, err := textmeasure.NewRuler()
	if err != nil {
		return nil, err
	}
	ruler.LineHeightFactor = .5
	err = graph.SetDimensions(nil, ruler, nil)
	if err != nil {
		return nil, err
	}
	err = d2dagrelayout.Layout(ctx, graph, nil)
	if err != nil {
		return nil, err
	}
	diagram, err := d2exporter.Export(ctx, graph, nil)
	if err != nil {
		return nil, err
	}

	return d2svg.Render(diagram, opts)
}
