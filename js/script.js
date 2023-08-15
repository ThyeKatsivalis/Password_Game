const inicio = () => {

    const distY = 40;
    const distX = 30;
    const raio = 11;
    const raioSinais = 3;

    let linhaAtual = 10;
    let pecaAtual = 0;

    const colors = ['lightgray', 'black', 'white', 'red', 'green', 'blue', 'purple'];

    const pecas = [0, 0, 0, 0];

    const posicaoSinais = [{ x: -5, y: -5 }, { x: 5, y: -5 }, { x: -5, y: 5 }, { x: 5, y: 5 }];
    const senha = Array.from({ length: 4 }, () => parseInt(Math.random() * 6) + 1); // essa linha será responsavel por gerar senhas aleatórias.

    const desenhaSeta = ({ posicao, raio, esquerda }) => {
        let dx = esquerda ? -raio : raio;
        ctx.beginPath();
        ctx.moveTo(posicao.x, posicao.y - raio);
        ctx.lineTo(posicao.x, posicao.y + raio);
        ctx.lineTo(posicao.x + dx, posicao.y);
        ctx.lineTo(posicao.x, posicao.y - raio);
        ctx.stroke();
    }

    const desenhaApaga = ({ posicao, raio }) => desenhaSeta({ posicao: posicao, raio: raio, esquerda: true, });
    const desenhaConfirma = ({ posicao, raio }) => desenhaSeta({ posicao: posicao, raio: raio, esquerda: false, });

    const desenhaCirculo = ({ posicao, raio, cor }) => {
        ctx.beginPath();
        ctx.fillStyle = colors[cor];
        ctx.arc(posicao.x, posicao.y, raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    const desenhaPosicao = ({ linha, pecas, sinais }) => {
        for (let i = 0; i < pecas.length; i += 1) {
            desenhaCirculo({ posicao: { x: distX * (i + 1), y: distY * (linha + 1) }, raio: raio, cor: pecas[i] });
        }
        if (sinais) {
            desenhaSinais({ linha: linha, sinais: sinais });
        }
    }

    const desenhaSinais = ({ linha, sinais }) => {
        const brancas = Array.from({ length: sinais.brancas }, () => 2)
        const pretas = Array.from({ length: sinais.pretas }, () => 1)
        const arraySinais = [...brancas, ...pretas];
        for (let i in arraySinais) {
            const { x, y } = posicaoSinais[i];
            const cor = arraySinais[i];
            desenhaCirculo({ posicao: { x: distX * 5 + x, y: distY * (linha + 1) + y }, raio: raioSinais, cor: cor });
        }
    }

    const colocaPeca = cor => {
        if (pecaAtual > 3) return;
        pecas[pecaAtual++] = cor;
        desenhaPosicao({ linha: linhaAtual, pecas: pecas })
    }

    const removePeca = () => {
        if (pecaAtual == 0) return;
        pecas[--pecaAtual] = 0;
        desenhaPosicao({ linha: linhaAtual, pecas: pecas })
    }

    const testaSenha = (s1, p1) => { // função que compara as senhas
        let senha = [...s1];
        let pecas = [...p1];
        let arrayBrancas = senha.map((e, i) => e == pecas[i]);
        let brancas = arrayBrancas.reduce((p1, p2) => p1 + p2);
        let pretas = 0;
        for (i1 in pecas) {
            if (arrayBrancas[i1]) continue;
            for (i2 in senha) {
                if (arrayBrancas[i2]) continue;
                if (pecas[i1] == senha[i2]) {
                    pretas++;
                    pecas[i1] = -1;
                    senha[i2] = -2;
                }
            }
        }

        return { brancas: brancas, pretas: pretas };
    }

    const confirmaLinha = () => { // função de confirmar jogada
        const resultado = testaSenha(senha, pecas);
        desenhaSinais({ linha: linhaAtual, sinais: resultado });
        if (resultado.brancas == 4) {
            desenhaPosicao({ linha: 0, pecas: senha });
            alert("Você venceu!");
        }
        if (linhaAtual == 1) {
            desenhaPosicao({ linha: 0, pecas: senha });
            alert("Você perdeu!");
        }
        linhaAtual--;
        pecaAtual = 0;
        pecas.fill(0);
    }

    const clique = e => {
        const x = e.offsetX;
        const y = e.offsetY;
        const peca = pecasInterface.find(e => e.x - raio < x && e.x + raio > x && e.y - raio < y && e.y + raio > y);
        peca.acao(peca.cor);
    }

    const pecasInterface = [
        { x: distX * 7, y: distY, cor: 1, desenho: desenhaCirculo, acao: colocaPeca },
        { x: distX * 8, y: distY, cor: 2, desenho: desenhaCirculo, acao: colocaPeca },
        { x: distX * 9, y: distY, cor: 3, desenho: desenhaCirculo, acao: colocaPeca },
        { x: distX * 7, y: distY * 2, cor: 4, desenho: desenhaCirculo, acao: colocaPeca },
        { x: distX * 8, y: distY * 2, cor: 5, desenho: desenhaCirculo, acao: colocaPeca },
        { x: distX * 9, y: distY * 2, cor: 6, desenho: desenhaCirculo, acao: colocaPeca },
        { x: distX * 7, y: distY * 3, cor: 1, desenho: desenhaApaga, acao: removePeca },
        { x: distX * 8, y: distY * 3, cor: 2, desenho: desenhaConfirma, acao: confirmaLinha }, // onde a linha é confirmada
    ];

    document.body.innerHTML = "<canvas id='idCanvas' width='320' height='500' style='border:1px solid #000000; background-color:lightgray'></canvas>";
    let canvas = document.getElementById('idCanvas');
    let ctx = canvas.getContext('2d');

    const sinais = { brancas: 1, pretas: 3 };

    for (let i = 0; i < 11; i += 1) {
        desenhaPosicao({ linha: i, pecas: pecas, });
    }

    for (peca of pecasInterface) {
        peca.desenho({ posicao: { x: peca.x, y: peca.y }, raio: raio, cor: peca.cor })
    }

    document.addEventListener('click', clique);
}
