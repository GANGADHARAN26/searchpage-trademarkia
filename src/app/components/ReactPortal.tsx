import  { useLayoutEffect, useState } from "react"; 
import { createPortal } from "react-dom";


// Function to create wrapper element with given ID and append it to the body
function createWrapperIDAndAppendBody(wrapperId) {
  const wrapperElement = document.createElement("div"); // Creating a div element
  wrapperElement.setAttribute("id", wrapperId); // Setting ID attribute
  document.body.appendChild(wrapperElement); // Appending the div to the body
  return wrapperElement; // Returning the created wrapper element
}

export default function ReactPortal({
  children,
  wrapperId = "react-portal-wrapper",
}) {
  const [wrapperElement, setWrapperElement] = useState(null); 

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId); // Trying to find existing wrapper element
    let systemCreated = false; // Flag to track if the element was created by the system
    if (!element) {
      systemCreated = true; // If wrapper element doesn't exist, mark it as system created
      element = createWrapperIDAndAppendBody(wrapperId); // Create wrapper element and append it to body
    }
    setWrapperElement(element); // Set the wrapper element in state
    return () => {
      // Cleanup function to remove programatically created element
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element); // Removing the element from its parent node
      }
    };
  }, [wrapperId]); // Dependency array for useEffect hook

  // If wrapper element is not yet available, return null
  if (wrapperElement === null) return null;

  // Rendering children inside portal using createPortal function
  return createPortal(children, wrapperElement);
}

