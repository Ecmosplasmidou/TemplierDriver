import React, { useEffect } from "react";
import Header from "./Header";

function Contact() {
  useEffect(() => {
    // Load HubSpot form
    const hubspotFormScript = document.createElement("script");
    hubspotFormScript.src =
      "https://js-eu1.hsforms.net/forms/embed/146085103.js";
    hubspotFormScript.defer = true;
    document.body.appendChild(hubspotFormScript);

    // Load contact.js
    const contactScript = document.createElement("script");
    contactScript.src = "/contact.js";
    contactScript.defer = true;
    document.body.appendChild(contactScript);

    // Load particles.js
    const particlesScript = document.createElement("script");
    particlesScript.src = "https://cdn.jsdelivr.net/npm/particles.js";
    particlesScript.defer = true;
    document.body.appendChild(particlesScript);

    // Load HubSpot tracking script
    const hsTrackingScript = document.createElement("script");
    hsTrackingScript.src = "//js-eu1.hs-scripts.com/146085103.js";
    hsTrackingScript.async = true;
    hsTrackingScript.defer = true;
    hsTrackingScript.id = "hs-script-loader";
    document.body.appendChild(hsTrackingScript);

    return () => {
      // Optional: clean up scripts on unmount
    };
  }, []);

  return (
    <>
      <Header />
      <div className="contact-container" style={{ marginTop: "11vh" }}>
        <div
          className="hs-form-frame"
          data-region="eu1"
          data-form-id="ca8550f2-3c51-4b2b-95ea-20895210a25b"
          data-portal-id="146085103"
        ></div>
      </div>

      <hr className="footer-separator" />
    </>
  );
}

export default Contact;
