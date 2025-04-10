import React, { useLayoutEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

// Function to create wrapper element with given ID and append it to the body
function createWrapperIDAndAppendBody(wrapperId: string): HTMLDivElement {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

type ReactPortalProps = {
  children: ReactNode;
  wrapperId?: string;
};

export default function ReactPortal({
  children,
  wrapperId = "react-portal-wrapper",
}: ReactPortalProps): React.ReactElement | null {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperIDAndAppendBody(wrapperId);
    }

    setWrapperElement(element);

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}
