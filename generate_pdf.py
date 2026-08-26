import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont('Helvetica', 8)
        self.setFillColor(colors.HexColor('#6B7280'))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, 'ViniGames — Guia Practica de Exposicion (Sergio Alvarez)')
            self.setStrokeColor(colors.HexColor('#E5E7EB'))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        footer_text = f'Pagina {self._pageNumber} de {page_count}'
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, 'Universidad Tecnologica Privada de Santa Cruz (UTEPSA)')
        self.setStrokeColor(colors.HexColor('#E5E7EB'))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

pdf_filename = 'Guia_Exposicion_ViniGames_Sergio.pdf'
doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    leftMargin=54,
    rightMargin=54,
    topMargin=54,
    bottomMargin=54
)

styles = getSampleStyleSheet()

primary_color = colors.HexColor('#581C87')
accent_color = colors.HexColor('#0284C7')
dark_text = colors.HexColor('#1F2937')

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#4C1D95'),
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#4B5563'),
    spaceAfter=10
)

h1_style = ParagraphStyle(
    'CustomH1',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=12.5,
    leading=16,
    textColor=colors.HexColor('#5B21B6'),
    spaceBefore=10,
    spaceAfter=5,
    keepWithNext=True
)

h2_style = ParagraphStyle(
    'CustomH2',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10.5,
    leading=14,
    textColor=colors.HexColor('#0369A1'),
    spaceBefore=6,
    spaceAfter=3,
    keepWithNext=True
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=dark_text,
    spaceAfter=5
)

bullet_style = ParagraphStyle(
    'CustomBullet',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=dark_text,
    leftIndent=12,
    spaceAfter=2.5
)

quote_style = ParagraphStyle(
    'CustomQuote',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#1E1B4B'),
    backColor=colors.HexColor('#EEF2FF'),
    borderColor=colors.HexColor('#6366F1'),
    borderWidth=1,
    borderPadding=7,
    spaceBefore=4,
    spaceAfter=6,
    borderRadius=4
)

box_style = ParagraphStyle(
    'CustomBox',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=dark_text,
    backColor=colors.HexColor('#F9FAFB'),
    borderColor=colors.HexColor('#E5E7EB'),
    borderWidth=1,
    borderPadding=6,
    spaceBefore=3,
    spaceAfter=5,
    borderRadius=4
)

story = []

# Title Banner
story.append(Paragraph('ViniGames — Guía Práctica de Exposición', title_style))
story.append(Paragraph('<b>Estudiante:</b> Sergio Alvarez &nbsp;|&nbsp; <b>Materia:</b> Desarrollo de Aplicaciones Web &nbsp;|&nbsp; <b>UTEPSA</b>', subtitle_style))
story.append(HRFlowable(width='100%', thickness=1.5, color=colors.HexColor('#7C3AED'), spaceBefore=0, spaceAfter=8))

# Seccion 1
story.append(Paragraph('1. ¿Qué es ViniGames? (Explicado en Fácil)', h1_style))
story.append(Paragraph('<b>ViniGames</b> es una <b>tienda virtual de videojuegos</b> (parecida a Steam o Epic Games), pero con una diferencia clave: <b>premia y motiva al jugador</b> mientras navega, compra y participa en la comunidad.', body_style))
story.append(Paragraph('<b>Las 3 funciones principales del sistema:</b>', body_style))
story.append(Paragraph('• <b>Tienda y Catálogo:</b> Permite explorar juegos, ver fotos, trailers en video, precios en Bolivianos (Bs.) y comprarlos con tarjeta virtual.', bullet_style))
story.append(Paragraph('• <b>Gamificación:</b> El usuario sube de nivel, gana puntos de experiencia (XP), medallas y mantiene una racha diaria por conectarse cada día.', bullet_style))
story.append(Paragraph('• <b>Reseñas Verificadas:</b> Solo los usuarios que realmente compraron un juego pueden dejar su opinión y calificarlo con estrellas.', bullet_style))

# Seccion 2
story.append(Paragraph('2. ¿Qué partes hiciste tú? (Tu Responsabilidad en el Proyecto)', h1_style))
story.append(Paragraph('Tú estuviste a cargo de <b>3 componentes fundamentales</b> de la plataforma:', body_style))

story.append(Paragraph('A) La Ficha del Videojuego (Pantalla de Detalle)', h2_style))
story.append(Paragraph('Es la pantalla que se abre al hacer clic en cualquier juego. En ella creaste:', body_style))
story.append(Paragraph('• <b>Galería Multimedia:</b> Reproductor para ver el tráiler oficial y cambiar de capturas de pantalla haciendo clic en las miniaturas.', bullet_style))
story.append(Paragraph('• <b>Caja de Precios:</b> Muestra el precio en Bs., la etiqueta de descuento (-20%), el botón de comprar y el botón de corazón.', bullet_style))
story.append(Paragraph('• <b>Requisitos del Sistema:</b> Tarjetas claras con requisitos Mínimos y Recomendados (memoria RAM, tarjeta de video, almacenamiento).', bullet_style))
story.append(Paragraph('• <b>Reseñas de la Comunidad:</b> Resumen visual de calificación (4.8 estrellas) y comentarios de otros jugadores.', bullet_style))

story.append(Paragraph('B) La Lista de Deseos (Wishlist)', h2_style))
story.append(Paragraph('Es la pantalla donde el jugador guarda sus videojuegos favoritos para comprarlos más adelante:', body_style))
story.append(Paragraph('• <b>Botón de Corazón (❤️):</b> Al presionarlo en cualquier parte de la tienda, se pinta de color rosa al instante y guarda el juego.', bullet_style))
story.append(Paragraph('• <b>Contador en el Menú Superior:</b> Muestra un número en tiempo real al lado de \"Deseados\" para saber cuántos juegos tienes guardados.', bullet_style))
story.append(Paragraph('• <b>Mover al Carrito:</b> Un botón que pasa el juego de tu lista de deseos directamente al carrito de compras con un solo clic.', bullet_style))

story.append(Paragraph('C) Almacenamiento de Imágenes (Storage)', h2_style))
story.append(Paragraph('• Configuraste el sistema para guardar las imágenes pesadas en carpetas en la nube (Supabase Storage), permitiendo que la base de datos se mantenga rápida y ligera.', body_style))

# Seccion 3
story.append(Paragraph('3. Tu Guion de Exposición (Lo que vas a decir)', h1_style))
story.append(Paragraph('Cuando te den la palabra, puedes explicar tu parte de esta manera sencilla y segura:', body_style))

speech_text = (
    '<i>\"Buenas tardes ingeniera y compañeros. Mi nombre es Sergio Alvarez y en ViniGames me encargué de dos módulos clave: <b>la Ficha de Detalle de los Videojuegos</b> y <b>la Lista de Deseos (Wishlist)</b>.<br/><br/>'
    'En la <b>Ficha del Juego</b>, diseñé toda la experiencia para que el usuario conozca el título antes de comprar: puede ver el tráiler en video, mirar capturas de pantalla, revisar si su computadora cumple con los requisitos del sistema y ver las calificaciones de la comunidad.<br/><br/>'
    'En la <b>Lista de Deseos</b>, conecté el botón de corazón en toda la plataforma. Cuando un usuario hace clic en el corazón de cualquier juego, se guarda automáticamente, se actualiza el contador de la barra superior en tiempo real y el jugador puede revisar sus favoritos en la página de Wishlist para comprarlos o moverlos al carrito con un solo clic.\"</i>'
)
story.append(Paragraph(speech_text, quote_style))

# Seccion 4
story.append(Paragraph('4. Demostración en Pantalla (Paso a Paso en Vivo)', h1_style))
story.append(Paragraph('Si te piden mostrar el proyecto funcionando en tu computadora, sigue estos 4 pasos:', body_style))
story.append(Paragraph('• <b>Paso 1:</b> Abre la página del juego (ej: <code>localhost:3000/games/neon-odyssey</code>). Muestra el video tráiler y las tarjetas de requisitos.', bullet_style))
story.append(Paragraph('• <b>Paso 2:</b> Haz clic en el <b>botón de corazón</b> al lado de \"Comprar ahora\". Muestra cómo se pinta de color rosa inmediatamente.', bullet_style))
story.append(Paragraph('• <b>Paso 3:</b> Señala con el mouse el menú superior: verán que en <b>\"Deseados\"</b> se actualizó el contador.', bullet_style))
story.append(Paragraph('• <b>Paso 4:</b> Haz clic en <b>\"Deseados\"</b> (o entra a <code>/wishlist</code>). Muestra la tarjeta del juego con su precio en Bs. y presiona el botón para moverlo al carrito o eliminarlo.', bullet_style))

# Seccion 5
story.append(Paragraph('5. Preguntas Típicas del Docente y Respuestas Simples', h1_style))

faq = [
    ('¿Por qué el botón de corazón cambia de color tan rápido sin que se recargue la página?',
     'Porque usamos una actualización inmediata en el navegador (React State y Context). La pantalla no necesita recargarse por completo; guarda el cambio al instante y lo sincroniza por detrás.'),
    
    ('¿Qué pasa si un usuario no ha iniciado sesión y guarda un juego en la wishlist?',
     'El sistema guarda sus favoritos en la memoria local de su navegador (localStorage) para que no se pierdan mientras navega, y cuando inicia sesión, se guardan en su cuenta en la base de datos.'),
     
    ('¿Dónde se guardan las fotos y carátulas de los juegos?',
     'No se guardan dentro de las tablas de la base de datos para no saturarla. Se guardan en un almacenamiento especial en la nube llamado Supabase Storage (en carpetas de portadas y capturas) y en la base de datos solo guardamos el enlace web de la imagen.'),
     
    ('¿Qué hace el botón \"Mover al Carrito\" de la Wishlist?',
     'Realiza dos acciones automáticas: agrega el juego a la lista de compras del carrito y lo quita de la lista de deseos para que el usuario no lo tenga duplicado.')
]

for q, a in faq:
    faq_box = f'<b>P: {q}</b><br/><font color=\"#15803D\"><b>R:</b></font> {a}'
    story.append(Paragraph(faq_box, box_style))

doc.build(story, canvasmaker=NumberedCanvas)
print('PDF generado exitosamente: Guia_Exposicion_ViniGames_Sergio.pdf')
