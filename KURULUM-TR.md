# Selim Uysal — Siteyi GitHub Pages üzerinde yayımlama

Bu paket, önceki siteden bağımsız olarak **SelimUysal/selim-uysal** adlı yeni depo için hazırlanmıştır.

## İlk kez yükleme (ücretsiz)

1. Bu paketi ZIP'ten çıkarın. İçinde `index.html`, `industry.html`, `projects.html`, `cv.html`, `industry-cv.html`, `assets/`, `scripts/` ve diğer dosyalar vardır.
2. [GitHub deponuzu](https://github.com/SelimUysal/selim-uysal) açın; `Add file` → `Upload files` ile **paketin içindeki dosya ve klasörleri** deponun ana dizinine yükleyin. Paketi ayrı bir klasörün içine koymayın; `index.html` kökte durmalıdır.
3. Mevcut README için de paketteki `README.md` dosyasını kullanın (yeni depoda şimdilik yalnızca `# selim-uysal` satırı vardı).
4. `Commit changes` ile değişiklikleri `main` dalına kaydedin.
5. Depoda `Settings` → `Pages` bölümüne girin. `Build and deployment` altında `Source: Deploy from a branch`, `Branch: main`, `Folder: /(root)` seçip `Save` düğmesine basın.
6. Yayın tamamlandıktan sonra [akademik ana sayfayı](https://selimuysal.github.io/selim-uysal/) açın. Farklı tarayıcıda ve telefonda da kontrol edin. Pages yayını ilk kez açılacağı için kısa bir dağıtım gecikmesi olabilir.

## Site bağlantıları

- Akademik: https://selimuysal.github.io/selim-uysal/
- Sektörel: https://selimuysal.github.io/selim-uysal/industry.html
- Proje kataloğu: https://selimuysal.github.io/selim-uysal/projects.html
- Akademik CV: https://selimuysal.github.io/selim-uysal/cv.html
- Sektörel CV: https://selimuysal.github.io/selim-uysal/industry-cv.html

## Yeni proje / bağlantı ekleme

Tüm proje bilgileri tek yerden, **`assets/content.js`** dosyasından yönetilir. Her projenin İngilizce ve Türkçe adı, açıklaması, teknolojileri ve bağlantıları tanımlıdır. Yeni canlı demo, GitHub kaynak kodu veya mağaza bağlantısı eklediğinizde ilgili `links` alanını güncelleyin.

Ardından, HTML'nin İngilizce önizleme içeriklerini güncellemek için bilgisayarda Node.js yüklüyken site klasöründe `node scripts/prerender.mjs` komutunu çalıştırın. Güncellenen dosyaları GitHub'a yükleyin. `npm install` gerekmez.

## Önemli notlar

- GitHub Pages üzerinde sunucu ve abonelik ücreti yoktur; bağımsız sunucu gerektiren servisler burada çalışmaz. Bu portfolyo statiktir.
- Akademik raporlar `assets/reports/`, sertifikalar `assets/certificates/`, akademik CV'nin PDF kopyası `assets/cv/` içindedir.
- TEKNOFEST sonucu yarışmanın **ön tasarım değerlendirmesinde 198 takım arasında 11'incilik** olarak belirtilmiştir; genel final sıralaması değildir.
- GitHub README dosyanız ile web sitesi aynı depoda birlikte bulunabilir, ancak README GitHub profilinde otomatik görünmeyebilir: özel profil README'si için depo adının tam olarak GitHub kullanıcı adıyla eşleşmesi gerekir.
- Sitenin yeni deponuzda henüz yayımlanmadığını bilerek, paylaşmadan önce bağlantıları kontrol edin.
