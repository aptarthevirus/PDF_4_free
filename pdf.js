document.getElementById("pdf").addEventListener("click", async function() {
    const urlInput = document.getElementById("pdfurl");
    const msg = document.getElementById("msg");
    
    if (!urlInput || !msg) return;

    const url = urlInput.value.trim();

    if (!url) {
        msg.textContent = "Please enter a valid URL";
        msg.style.color = "red";
        return;
    }

    try {
        new URL(url);
    } catch (e) {
        msg.textContent = "Please enter a valid URL";
        msg.style.color = "red";
        return;
    }

    try {
        msg.textContent = "Starting download...";
        msg.style.color = "blue";
        
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/pdf")) {
            console.warn("Warning: The received file might not be a PDF. Content-Type:", contentType);
        }

        const blob = await response.blob();
        
        //
        if (blob.size === 0) {
            throw new Error("Downloaded file is empty");
        }

        const blobUrl = window.URL.createObjectURL(blob);

        // 5.
        const link = document.createElement("a");
        link.href = blobUrl;
        
      
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1] || "downloaded_file.pdf";
        link.download = filename.includes('.pdf') ? filename : "downloaded_file.pdf";
        
        
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();

        //  Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);

        msg.textContent = "PDF downloaded successfully!!!!";
        msg.style.color = "blue";

    } catch (error) {
        console.error("Download Error:", error);
        
        
        let errorMessage = error.message;
        if (error.message.includes("Failed to fetch")) {
            errorMessage = "CORS Error: The PDF server doesn't allow cross-origin requests. Try downloading directly.";
        
        }
        
        
        
        msg.textContent = `Error: ${errorMessage}`;
        msg.style.color = "red";
    
    }


});
