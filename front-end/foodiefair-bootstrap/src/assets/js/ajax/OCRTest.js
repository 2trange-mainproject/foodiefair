function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = async function(e) {
            document.getElementById('preview').src = e.target.result;

            // Get the base64 data without the 'data:image/png;base64,' prefix
            const base64Data = e.target.result.split(',')[1];

            // Send the base64 data to BackEndServer
            const response = await requestWithBase64(base64Data);

            // Handle the API response here
            console.log(response);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('preview').src = "";
    }
}

async function requestWithBase64(base64Data) {
    const url = "http://localhost:8081/api/receipt/";
    const data = {
        image: base64Data
    };
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

