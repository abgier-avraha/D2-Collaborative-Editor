'use client';

import { useEffect, useMemo, useState } from "react";
import { D2Api } from "../d2-api";

interface IProps {
  script?: string;
  className?: string;
}

export function D2Preview(props: IProps) {
  const [base64Svg, setBase64Svg] = useState<string>();


  useEffect(() => {
    let mounted = true;

    (async () => {
      if (props.script === undefined) {
        return;
      }
      const res = await D2Api.fetchSvgBase64(props.script);
      if (mounted) {
        setBase64Svg(`data:image/svg+xml;base64,${res}`);
      }
    })();

    return () => {
      mounted = false;
    }
  }, [props.script])

  return (
    <img src={base64Svg} className={props.className}></img>
  )
}