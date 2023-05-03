/* reviewRegister.js에 합침
function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = async function (e) {
            document.getElementById('OCR_preview').src = e.target.result;

            const base64Data = e.target.result.split(',')[1];

            const response = await requestWithBase64(base64Data);

        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('OCR_preview').src = "";
    }
}

async function requestWithBase64(base64Data) {
    const url = "http://localhost:8081/api/receipt/";
    const data = {
        image: base64Data
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const jsonResponse = await response.json();
        console.log(jsonResponse);
        ocrConfirmModal(jsonResponse);

    } catch (error) {
        console.log('Error processing request:', error);
    }
}

function ocrConfirmModal(jsonResponse) {
    let OCRContainer = $('#OCRContainer');
    OCRContainer.empty();
    let ocrModal = '';
    if (jsonResponse.status === 'success') {
        ocrModal += `
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Receipt authentication succeeded</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    Authentication succeeded
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>`;
    } else {
        ocrModal += `
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Receipt authentication failed</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    영수증 인증을 실패했습니다.</br>
                    [인증 실패]</br>
                    올바른 영수증인지 다시 확인 해주세요.</br>
                    해당 상품의 영수증이 아닐 수 있습니다.</br>
                    영수증이 훼손된 경우, 정확한 판독이 어렵습니다.</br>
                    자세한 사항은 문의사항을 통해 문의해주세요.
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>`;
    }
    OCRContainer.append(ocrModal);
}
*/
