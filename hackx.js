// Função para extrair números da URL
function getQuestionIdFromUrl() {
  const url = window.location.href;
  const numberMatch = url.match(/\d+/g); // Extrai todos os números da URL
  return numberMatch ? numberMatch.find(num => num.length > 5) : null; // Assume que o ID tem mais de 5 dígitos
}

// Função para buscar o JSON do GitHub
async function fetchAnswers() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/KeyzerCR/pphack/refs/heads/main/respostas.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return null;
  }
}

// Função para criar a GUI discreta
function createGUI(answer) {
  const gui = document.createElement('div');
  gui.style.position = 'fixed';
  gui.style.bottom = '10px';
  gui.style.right = '10px';
  gui.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  gui.style.color = 'white';
  gui.style.padding = '10px';
  gui.style.borderRadius = '5px';
  gui.style.fontSize = '14px';
  gui.style.zIndex = '9999';
  gui.style.maxWidth = '300px';
  gui.style.wordWrap = 'break-word';
  gui.textContent = answer || 'Resposta não encontrada';
  document.body.appendChild(gui);

  // Remove a GUI após 10 segundos
  setTimeout(() => {
    gui.remove();
  }, 10000);
}

// Função principal
async function main() {
  const questionId = getQuestionIdFromUrl();
  if (!questionId) {
    console.log('Nenhum ID válido encontrado na URL');
    return;
  }

  const answers = await fetchAnswers();
  if (!answers) return;

  // Procura a questão pelo ID
  const question = answers.find(item => item.id_da_questao === parseInt(questionId));
  if (question && question.alternativa_correta) {
    const answer = Object.values(question.alternativa_correta)[0];
    createGUI(answer);
  } else {
    createGUI('Resposta não encontrada para o ID: ' + questionId);
  }
}

// Executa o bot
main();
