/**
 * Pulso Concept — backend do formulário de contato.
 *
 * COMO IMPLANTAR:
 * 1. Crie/abra a planilha do Google Sheets que vai receber os leads.
 * 2. Extensões > Apps Script.
 * 3. Apague o conteúdo padrão do Code.gs e cole este arquivo inteiro.
 * 4. Ajuste NOTIFICATION_EMAIL abaixo para o e-mail que deve receber o aviso.
 * 5. Implantar > Nova implantação > tipo "App da Web".
 *      - Executar como: Eu (sua conta)
 *      - Quem pode acessar: Qualquer pessoa
 * 6. Copie a URL do Web App gerada e coloque em VITE_GOOGLE_SCRIPT_URL no .env do projeto.
 * 7. Sempre que editar este arquivo, faça "Gerenciar implantações > Editar > Nova versão"
 *    para publicar as mudanças (a URL continua a mesma).
 *
 * Sempre que os campos do formulário mudarem, atualize HEADERS abaixo — o
 * cabeçalho da planilha é corrigido automaticamente a cada envio.
 */

const SHEET_NAME = "Leads";
const NOTIFICATION_EMAIL = "SEU_EMAIL_AQUI@gmail.com";

const HEADERS = [
  "Data",
  "Nome",
  "E-mail",
  "WhatsApp",
  "Interesse",
  "Frequência desejada",
  "Horário preferido",
  "Tipo de treino no horário",
];

const INTEREST_LABELS = {
  funcional: "Treino funcional",
  academia: "Academia",
  "os-dois": "Os dois",
};

const TRAINING_TYPE_LABELS = {
  funcional: "Funcional",
  hiit: "HIIT 40'",
  pilates: "Pilates Funcional",
  musculacao: "Musculação",
  "funcional-teen": "Funcional Teen",
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const phone = sanitize(data.phone);
    const interest = sanitize(data.interest);
    const frequency = sanitize(data.frequency);
    const preferredTime = sanitize(data.preferredTime);
    const trainingType = sanitize(data.trainingType);

    if (
      !name ||
      !email ||
      !phone ||
      !interest ||
      !frequency ||
      !preferredTime ||
      !trainingType
    ) {
      return jsonResponse({
        status: "error",
        message: "Campos obrigatórios ausentes.",
      });
    }

    const interestLabel = INTEREST_LABELS[interest] || interest;
    const trainingTypeLabel = TRAINING_TYPE_LABELS[trainingType] || trainingType;

    const sheet = getOrCreateSheet();
    sheet.appendRow([
      new Date(),
      name,
      email,
      phone,
      interestLabel,
      frequency,
      preferredTime,
      trainingTypeLabel,
    ]);

    if (
      NOTIFICATION_EMAIL &&
      NOTIFICATION_EMAIL.indexOf("SEU_EMAIL_AQUI") === -1
    ) {
      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: "Novo contato pelo site — Pulso Concept",
        body:
          "Novo pedido de contato recebido pelo site. A pessoa NÃO agendou " +
          "nada — o formulário só coleta o interesse dela para a nossa " +
          "equipe entrar em contato:\n\n" +
          "Nome: " + name + "\n" +
          "E-mail: " + email + "\n" +
          "WhatsApp: " + phone + "\n" +
          "Interesse: " + interestLabel + "\n" +
          "Frequência desejada: " + frequency + "\n" +
          "Horário preferido: " + preferredTime + " (" + trainingTypeLabel + ")",
      });
    }

    return jsonResponse({ status: "success" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.message });
  }
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const headersMatch = HEADERS.every((h, i) => currentHeaders[i] === h);
  if (!headersMatch) {
    headerRange.setValues([HEADERS]);
  }

  return sheet;
}

function sanitize(value) {
  return String(value || "").trim().slice(0, 500);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
