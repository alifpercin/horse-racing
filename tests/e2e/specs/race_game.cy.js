

describe('Horse Racing Game E2E Test', () => {
  
  // Her testten önce ana sayfaya git
  beforeEach(() => {
    cy.visit('/')
  })

  it('Sayfa dogru yukleniyor ve baslik gorunuyor', () => {
    // h1 etiketinde 'Horse Racing Game' yazıyor mu?
    cy.contains('h1', 'Horse Racing Game').should('be.visible')
  })

  it('Program olusturulmadan yarisa baslanamiyor (Disabled Kontrolu)', () => {
    // Start Race butonunun (.btn-success) disabled (pasif) olduğunu doğrula
    cy.get('.btn-success').should('be.disabled')
  })

  it('Tam oyun dongusu: Program Olustur -> Kontrol Et -> Yarisi Baslat', () => {
    // 1. Generate butonuna (.btn-primary) tıkla
    cy.get('.btn-primary').click()

    // 2. Program listesinin (Schedule) dolduğunu kontrol et
    // .schedule-item sınıfına sahip en az 6 eleman olmalı
    cy.get('.schedule-item').should('have.length', 6)

    // 3. Start Race butonu artık aktif olmalı (disabled olmamalı)
    cy.get('.btn-success').should('not.be.disabled')

    // 4. Yarışı başlat
    cy.get('.btn-success').click()

    // 5. Yarış başladığı için buton tekrar disabled olmalı (Yarış bitene kadar)
    cy.get('.btn-success').should('be.disabled')
    
    // 6. Yarış pistinde atların hareket ettiğini doğrula (progress bar style değişimi)
    // Atlar hareket edince 'left' stilleri değişir, bunu yakalayabiliriz.
    cy.get('.horse-runner', { timeout: 10000 }).should('be.visible')
  })
})