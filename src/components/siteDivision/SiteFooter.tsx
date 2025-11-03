import '../../cssComponents/siteDivision/siteFooter.css';

function SiteFooter() {

  return (
    <>
      <footer>
          <div className="footer-content">
              <div className="footer-section">
                  <h4>FastThan</h4>
                  <p>Qualidade, Confiança e Elegância desde 2024.</p>
              </div>
              
              <div className="footer-section footer-links">
                  <h4>Links Rápidos</h4>
                  <ul>
                      <li><a href="#">Termos de Uso</a></li>
                      <li><a href="#">Política de Privacidade</a></li>
                  </ul>
              </div>
              
              <div className="footer-section">
                  <h4>Contato</h4>
                  <address>
                      Rua da Elegancia, 123<br/>
                      Cidade Sofisticada, UF<br/>
                      Telefone: (00) 1234-5678<br/>
                      Email: <a href="mailto:contato@loja.com">contato@loja.com</a>
                  </address>
              </div>
          </div>
          
          <div className="footer-bottom">
              <p>&copy; 2025 Nome da Loja. Todos os direitos reservados.</p>
          </div>
      </footer>
    </>
  )
}

export default SiteFooter
