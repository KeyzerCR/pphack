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

// Função para criar a GUI com a resposta
function createAnswerGUI(answer) {
  // Remove qualquer GUI anterior
  const existingGui = document.querySelector('#answer-gui');
  if (existingGui) existingGui.remove();

  const gui = document.createElement('div');
  gui.id = 'answer-gui';
  gui.style.position = 'fixed';
  gui.style.bottom = '40px'; // Acima do botão
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

// Função para criar o botão discreto
function createButton() {
  const button = document.createElement('button');
  button.textContent = '🔍'; // Ícone discreto (lupa)
  button.style.position = 'fixed';
  button.style.bottom = '10px';
  button.style.right = '10px';
  button.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Fundo quase transparente
  button.style.border = 'none';
  button.style.color = 'white';
  button.style.padding = '5px';
  button.style.borderRadius = '50%'; // Formato circular
  button.style.fontSize = '12px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '10000';
  button.style.opacity = '0.5'; // Bem discreto
  button.style.transition = 'opacity 0.3s';
  button.onmouseover = () => (button.style.opacity = '1'); // Aumenta opacidade no hover
  button.onmouseout = () => (button.style.opacity = '0.5');

  // Evento de clique
  button.onclick = async () => {
    const questionId = getQuestionIdFromUrl();
    if (!questionId) {
      createAnswerGUI('Nenhum ID válido encontrado na URL');
      return;
    }

    const answers = await fetchAnswers();
    if (!answers) {
      createAnswerGUI('Erro ao buscar respostas');
      return;
    }

    const question = answers.find(item => item.id_da_questao === parseInt(questionId));
    if (question && question.alternativa_correta) {
      const answer = Object.values(question.alternativa_correta)[0];
      createAnswerGUI(answer);
    } else {
      createAnswerGUI('Resposta não encontrada para o ID: ' + questionId);
    }
  };

  document.body.appendChild(button);
}

// Executa a criação do botão ao carregar
createButton();
