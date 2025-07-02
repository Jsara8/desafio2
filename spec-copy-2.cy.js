describe('CRUD Produtos', () => {

  beforeEach(() => {
    // Visita a página
    cy.visit('http://127.0.0.1:5500/sistema/produtos.html');

    // Se o modal estiver aberto, fecha para evitar bloqueio
    cy.get('#cadastro-produto').then($modal => {
      if ($modal.hasClass('show')) {
        cy.get('#btn-sair').click({ force: true });
        cy.wait(500); // espera fechar
      }
    });
  });

  it('Deve acessar a tela de produtos', () => {
    cy.contains('Controle de produtos').should('be.visible');
  });

  it('Deve abrir o modal de criação de produto', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#cadastro-produto').should('be.visible');
  });

  it('Deve cadastrar um produto válido', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#codigo').type('123');
    cy.get('#nome').type('Produto Teste');
    cy.get('#quantidade').type('5');
    cy.get('#valor').type('50');
    cy.get('#data').type('2025-12-01');
    cy.get('#btn-salvar').click();

    // Verifica se o produto foi adicionado à tabela
    cy.get('tbody tr').last().should('contain', '123');
    cy.get('tbody tr').last().should('contain', 'Produto Teste');
  });

  it('Não deve salvar produto com campos vazios', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#btn-salvar').click();

    cy.get('.alert').should('be.visible')
      .and('contain', 'Todos os campos são obrigatórios');
  });

  it('Deve limpar campos ao sair do modal', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#codigo').type('999');
    cy.get('#btn-sair').click({ force: true });

    // Espera até o modal fechar (classe .show sumir)
    cy.get('#cadastro-produto', { timeout: 10000 })
      .should($modal => {
        expect($modal).not.to.have.class('show');
      });

    cy.get('#btn-adicionar').click();
    cy.get('#codigo').should('have.value', '');
  });

  it('Deve fechar o modal ao clicar no botão Sair', () => {
    cy.get('#btn-adicionar').click();

    cy.get('#btn-sair').click({ force: true });

    cy.get('#cadastro-produto', { timeout: 10000 })
      .should($modal => {
        expect($modal).not.to.have.class('show');
      });
  });

  it('Deve conter botões Editar e Excluir após cadastro', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#codigo').type('777');
    cy.get('#nome').type('Produto Botões');
    cy.get('#quantidade').type('3');
    cy.get('#valor').type('30');
    cy.get('#data').type('2025-12-02');
    cy.get('#btn-salvar').click();

    cy.get('tbody tr').last().find('button').should('have.length', 2)
      .and('contain', 'Editar')
      .and('contain', 'Excluir');
  });

  it('Deve excluir um produto da tabela', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#codigo').type('321');
    cy.get('#nome').type('Produto Excluir');
    cy.get('#quantidade').type('2');
    cy.get('#valor').type('25');
    cy.get('#data').type('2025-12-03');
    cy.get('#btn-salvar').click();

    // Força o clique pois pode estar coberto
    cy.contains('Produto Excluir')
      .parents('tr')
      .find('button')
      .contains('Excluir')
      .click({ force: true });

    cy.contains('Produto Excluir').should('not.exist');
  });

  it('Deve abrir modal para editar um produto', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#codigo').type('888');
    cy.get('#nome').type('Produto Editar');
    cy.get('#quantidade').type('4');
    cy.get('#valor').type('40');
    cy.get('#data').type('2025-12-04');
    cy.get('#btn-salvar').click();

    // Força o clique no botão editar, pode estar coberto
    cy.contains('Produto Editar')
      .parents('tr')
      .find('button')
      .contains('Editar')
      .click({ force: true });

    cy.get('#cadastro-produto').should('be.visible');
  });

  it('Deve exibir alerta somente se campos estiverem inválidos', () => {
    cy.get('#btn-adicionar').click();
    cy.get('#nome').type('Teste');
    cy.get('#btn-salvar').click();

    cy.get('.alert').should('be.visible')
      .and('contain', 'Todos os campos são obrigatórios');
  });

});


