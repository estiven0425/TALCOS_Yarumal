const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { format } = require("date-fns");
const { es } = require("date-fns/locale");

const generarPDF = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const logoPath = path.join(__dirname, "../uploads/logo.png");

    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    }

    const fecha = format(
      new Date(),
      "EEEE d 'de' MMMM 'del' yyyy ' - ' HH:mm",
      {
        locale: es,
      }
    );
    const htmlContent = `
    <html>
        <head>
            <style>
                @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

                html {
                    font-family: "Inter", serif;
                    font-size: 16px;
                    font-weight: 400;
                }
                    
                body {
                    margin: 0px;
                    padding: 10px;
                }
                    
                table {
                    border-collapse: separate;
                    border-spacing: 0px 10px;
                    height: 100%;
                    width: 100%;
                } 
                thead {
                    display: table-header-group;
                    height: 15%;
                    width: 100%;
                }

                .header {
                    align-content: stretch;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                }

                .header section {
                    align-content: center;
                    align-items: flex-end;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    padding: 0px 10px;
                }
                    
                .header section img {
                    height: auto;
                    width: 200px;
                }

                .header section p {
                    margin: 0px;
                }
                    
                .header hr {
                    width: 99%;
                }
                    
                .header h1 {
                    color: #696a9e;
                    font-size: 1.5rem;
                    margin: 0px;
                    text-align: center;
                }

                tbody {
                    display: table-row-group;
                    height: 80%;
                    width: 100%;
                }

                .main {
                    align-content: stretch;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    gap: 25px;
                    justify-content: flex-start;
                }

                .mainValidation {
                    font-size: 1.5rem;
                    margin: 0px;
                    text-align: center;
                }
                    
                tfoot {
                    display: table-footer-group;
                    height: 5%;
                    width: 100%;
                }

                .footer {
                    align-content: stretch;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                }

                .footer hr {
                    width: 99%;
                }

                .footer p {
                    margin: 0px;
                    text-align: center;
                }
                
                .footer span {
                    color: #696a9e;
                    font-size: 1.25rem;
                }

                thead tr,
                tbody tr,
                tfoot tr {
                    width: 100%;
                }

                thead tr td,
                tbody tr td,
                tfoot tr td  {
                    vertical-align: baseline;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <td>
                            <div class="header">
                                <section>
                                    <img src="${logoBase64}" alt="Logo de la empresa" />
                                    <p>${fecha}</p>
                                </section>
                                <hr />
                                <h1>${titulo}</h1>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="main">
                                ${
                                  contenido ||
                                  "<h1 class='mainValidation'>No hay contenido disponible</h1>"
                                }
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <div class="footer">
                                <hr />
                                <p>powered by <span>TALCOS Yarumal - 2025</span></p>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </body>
    </html>
    `;
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    fs.writeFileSync("debug.pdf", pdfBuffer);

    if (res.headersSent) {
      console.error(
        "Los encabezados ya fueron enviados antes de res.end(pdfBuffer)"
      );
      return;
    }

    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
    res.setHeader("Content-Type", "application/pdf");

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generando el PDF:", error);

    res.status(500).send("Error al generar el PDF");
  }
};

module.exports = { generarPDF };
