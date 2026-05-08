document.getElementById("pdf").addEventListener("click", async function() {
    const urlInput = document.getElementById("pdfurl");
    const msg = document.getElementById("msg");
    
    // 1. Ensure elements exist before accessing values
    if (!urlInput || !msg) return;

    const url = urlInput.value.trim();

    if (!url) {
        msg.textContent = "Please enter a valid URL";
        return;
    }

    // Helper function to get the CSRF token
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    try {
        msg.textContent = "Starting download...";
        
        const csrfToken = getCookie("csrftoken");
        
        // 2. Fetch configuration
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Only attach token if it exists to avoid sending "undefined" string
                ...(csrfToken && { "X-CSRF-TOKEN": csrfToken })
            },
            body: JSON.stringify({}), // POST requests usually expect a body
            credentials: "same-origin" 
        });

        // 3. Handle non-OK responses (e.g., 403 Forbidden, 404 Not Found)
        if (!response.ok) {
            const errorText = await response.text(); // Try to get server error message
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        // 4. Validate Content-Type (Ensure it's actually a PDF)
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/pdf")) {
            console.warn("The received file might not be a PDF.");
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // 5. Improved Download Logic
        const link = document.createElement("a");
        link.href = blobUrl;
        
        // Use a dynamic name if provided by the server, otherwise default
        link.download = "downloaded_file.pdf";
        
        link.style.display = "none"; // Ensure it doesn't affect layout
        document.body.appendChild(link);
        link.click();

        // 6. Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);

        msg.textContent = "PDF downloaded successfully!";
        msg.style.color = "green";

    } catch (error) {
        console.error("Download Error:", error);
        msg.textContent = `Error: ${error.message}`;
        msg.style.color = "red";
    }
});
