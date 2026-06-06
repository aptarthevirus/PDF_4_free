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

    
    // 2. Validate URL
    try {
        new URL(url);
    } catch (error) {
        msg.textContent = "Please enter a valid URL";
        msg.style.color = "red";
        return;
    }

    try {
        msg.textContent = "Starting download...";
        msg.style.color = "black";
        
        // Fetch the PDF
        const response = await fetch(url, {
            method: "GET",  // ✅ Correct: Use GET for downloads
            mode: "cors",   // Allow cross-origin requests
            headers: {
                "Accept": "application/pdf"
            }
        });

        

        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }



        
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/pdf")) {
            console.warn("Warning: The received file might not be a PDF. Content-Type:", contentType);
        }

        const blob = await response.blob();
        


        
        if (blob.size === 0) {
            throw new Error("Downloaded file is empty");
        }

        
        const blobUrl = window.URL.createObjectURL(blob);

        
        const link = document.createElement("a");
        link.href = blobUrl;
        


        
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1] || "downloaded_file.pdf";
        link.download = filename.includes('.pdf') ? filename : "downloaded_file.pdf";
        
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();

        // 8. Clean up
        
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);

        msg.textContent = "PDF downloaded successfully!!!";
        msg.style.color = "green";

    } catch (error) {
        console.error("Download Errors:", error);
        
        
        let errorMessage = `Error: ${error.message}`;
        if (error.message.includes("Failed to fetch")) {
            errorMessage = "Error: CORS issue - The PDF URL may not allow downloads from this domain sorry for that";
        }
        
        msg.textContent = errorMessage;
        msg.style.color = "red";
    }
});
