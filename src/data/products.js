// Banco de dados com produtos reais para M Moto - Protegido contra alterações (F12)

export const categories = Object.freeze([
  { id: 'all', name: 'Todos' },
  { id: 'capacetes', name: 'Capacetes' },
  { id: 'vestuario', name: 'Jaquetas & Luvas' },
  { id: 'pecas', name: 'Peças & Motores' },
  { id: 'retrovisores', name: 'Retrovisores' },
  { id: 'acessorios', name: 'Acessórios' }
]);

export const products = Object.freeze([
  {
    id: 1,
    title: 'Capacete Carbono AGV K6 Premium Red Line',
    category: 'capacetes',
    categoryName: 'Capacetes',
    price: 3890.00,
    rating: 4.9,
    reviews: 142,
    description: 'O capacete de estrada mais leve do mundo, agora em versão carbono premium. Máxima proteção e conforto aero-dinâmico projetado para pistas e ruas. Viseira anti-risco com pinlock incluso.',
    attributes: {
      label: 'Tamanho',
      options: ['56', '58', '60', '62']
    },
    isBestSeller: true,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Luvas Alpinestars GP Pro R3 Couro Racing',
    category: 'vestuario',
    categoryName: 'Jaquetas & Luvas',
    price: 989.00,
    rating: 4.8,
    reviews: 89,
    description: 'Luvas esportivas profissionais construídas em couro bovino e couro de cabra. Proteção de juntas em polímero rígido contra abrasão e costuras externas para máximo conforto.',
    attributes: {
      label: 'Tamanho',
      options: ['P', 'M', 'G', 'GG']
    },
    isBestSeller: false,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1609630775171-b1321377ee65?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Escapamento Esportivo Akrapovic Carbon Slip-On',
    category: 'pecas',
    categoryName: 'Peças & Motores',
    price: 5490.00,
    rating: 5.0,
    reviews: 56,
    description: 'Ponteira Akrapovic fabricada em Titânio com bocal de Fibra de Carbono. Aumento instantâneo de potência, redução drástica de peso e ronco esportivo icônico homologado.',
    attributes: {
      label: 'Modelo da Moto',
      options: ['Honda Hornet', 'Yamaha MT-09', 'Kawasaki Z900', 'BMW S1000RR']
    },
    isBestSeller: true,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Jaqueta Alpinestars T-GP Plus R V3 Air',
    category: 'vestuario',
    categoryName: 'Jaquetas & Luvas',
    price: 1890.00,
    rating: 4.7,
    reviews: 112,
    description: 'Jaqueta de tecido altamente resistente à abrasão com painéis de malha ventilada (mesh). Ideal para pilotagem em dias quentes com proteções Nucleon Flex Plus certificadas nos ombros e cotovelos.',
    attributes: {
      label: 'Tamanho',
      options: ['P', 'M', 'G', 'GG', 'XG']
    },
    isBestSeller: false,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Retrovisores Esportivos Rizoma Stealth (Par)',
    category: 'retrovisores',
    categoryName: 'Retrovisores',
    price: 1150.00,
    rating: 4.9,
    reviews: 64,
    description: 'Retrovisor com design aerodinâmico inspirado em asas de caça militar. Feito em alumínio usinado CNC de alta qualidade, funciona como retrovisor e gera downforce (pressão aerodinâmica) em altas velocidades.',
    attributes: {
      label: 'Cor',
      options: ['Preto Fosco', 'Vermelho Racing', 'Alumínio Escovado']
    },
    isBestSeller: true,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Suporte de Celular Metal com Amortecedor Vibração',
    category: 'acessorios',
    categoryName: 'Acessórios',
    price: 349.00,
    rating: 4.6,
    reviews: 204,
    description: 'Suporte de guidão robusto fabricado em alumínio aeronáutico. Possui sistema de amortecimento mecânico de vibrações em elastômero premium que protege as câmeras de smartphones contra quebras de foco.',
    attributes: {
      label: 'Montagem',
      options: ['Guidão Padrão', 'Mesa de Direção', 'Base Retrovisor']
    },
    isBestSeller: false,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Amortecedor de Direção Maxracing Max-Pro',
    category: 'pecas',
    categoryName: 'Peças & Motores',
    price: 1850.00,
    rating: 4.9,
    reviews: 43,
    description: 'Evita a oscilação violenta do guidão (shimming) em altas velocidades. Sistema hidráulico regulável com 20 cliques de precisão. Suporte específico em alumínio billet anodizado.',
    attributes: {
      label: 'Ano da Moto',
      options: ['2018 - 2020', '2021 - 2023', '2024+']
    },
    isBestSeller: false,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'Intercomunicador Cardo Packtalk Edge Duo JBL',
    category: 'acessorios',
    categoryName: 'Acessórios',
    price: 4999.00,
    rating: 4.9,
    reviews: 97,
    description: 'O melhor comunicador para motociclistas do mundo. Conectividade Mesh 2.0 para até 15 pilotos. Som de alta fidelidade assinado pela JBL. Fixação magnética Air Mount super segura e comandos por voz.',
    attributes: {
      label: 'Versão',
      options: ['Kit Single (1 unidade)', 'Kit Duo (2 unidades)']
    },
    isBestSeller: true,
    mlLinked: true,
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80'
  }
]);
