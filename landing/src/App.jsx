import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  FileText,
  Award,
  Target,
  Zap
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import blogArticles from './blog-content.js'
import BlogArticle from './BlogArticle.jsx'
import './App.css'

function App() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [signupFormData, setSignupFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: ''
  })
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    mensagem: ''
  })

  // Dados para os gráficos
  const recoveryData = [
    { month: 'Jan', value: 980000, formatted: 'R$ 980K' },
    { month: 'Fev', value: 1200000, formatted: 'R$ 1.2M' },
    { month: 'Mar', value: 1400000, formatted: 'R$ 1.4M' },
    { month: 'Abr', value: 1100000, formatted: 'R$ 1.1M' },
    { month: 'Mai', value: 1600000, formatted: 'R$ 1.6M' },
    { month: 'Jun', value: 1800000, formatted: 'R$ 1.8M' },
    { month: 'Jul', value: 1500000, formatted: 'R$ 1.5M' },
    { month: 'Ago', value: 1700000, formatted: 'R$ 1.7M' },
    { month: 'Set', value: 1900000, formatted: 'R$ 1.9M' },
    { month: 'Out', value: 1300000, formatted: 'R$ 1.3M' },
    { month: 'Nov', value: 1400000, formatted: 'R$ 1.4M' },
    { month: 'Dez', value: 1500000, formatted: 'R$ 1.5M' }
  ]

  const protestTypeData = [
    { name: 'Duplicatas', value: 45, amount: 6800000, color: '#3b82f6' },
    { name: 'Cheques', value: 30, amount: 4600000, color: '#10b981' },
    { name: 'Notas Promissórias', value: 15, amount: 2300000, color: '#8b5cf6' },
    { name: 'Outros', value: 10, amount: 1500000, color: '#f59e0b' }
  ]

  const successRateData = [
    { month: 'Jan', rate: 62 },
    { month: 'Fev', rate: 65 },
    { month: 'Mar', rate: 68 },
    { month: 'Abr', rate: 64 },
    { month: 'Mai', rate: 70 },
    { month: 'Jun', rate: 72 },
    { month: 'Jul', rate: 69 },
    { month: 'Ago', rate: 71 },
    { month: 'Set', rate: 74 },
    { month: 'Out', rate: 67 },
    { month: 'Nov', rate: 68 },
    { month: 'Dez', rate: 68 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "Silva & Associados",
      role: "CEO",
      content: "Recuperamos R$ 2.3 milhões em apenas 8 meses. O ProtestoPro revolucionou nossa gestão de crédito. A automação nos permitiu focar no crescimento do negócio.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      results: "R$ 2.3M recuperados",
      timeframe: "8 meses"
    },
    {
      name: "Ana Costa",
      company: "TechCorp Brasil",
      role: "Diretora Financeira",
      content: "A plataforma é intuitiva e os resultados são impressionantes. Taxa de recuperação de 78%! Nossa equipe financeira economiza 15 horas por semana.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      results: "78% taxa de sucesso",
      timeframe: "6 meses"
    },
    {
      name: "Roberto Mendes",
      company: "Indústria Mendes",
      role: "Gerente Financeiro",
      content: "Automatizou todo nosso processo de cobrança. Economizamos 60% do tempo e aumentamos a eficiência. O ROI foi de 400% no primeiro ano.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      results: "400% ROI",
      timeframe: "1 ano"
    },
    {
      name: "Mariana Santos",
      company: "Distribuidora Santos",
      role: "Sócia-Diretora",
      content: "Impressionante como a IA da plataforma segmenta os devedores. Conseguimos recuperar R$ 890 mil de uma carteira que considerávamos perdida.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      results: "R$ 890K recuperados",
      timeframe: "5 meses"
    },
    {
      name: "João Oliveira",
      company: "Construtora Oliveira",
      role: "Diretor Comercial",
      content: "O protesto automatizado é fantástico. Em 3 meses, nossa inadimplência caiu de 12% para 4%. Recomendo para qualquer empresa.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      results: "Inadimplência -67%",
      timeframe: "3 meses"
    },
    {
      name: "Patricia Lima",
      company: "Grupo Lima Transportes",
      role: "CFO",
      content: "Plataforma completa e suporte excepcional. Recuperamos mais de R$ 1.5 milhão e melhoramos nosso fluxo de caixa significativamente.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      results: "R$ 1.5M recuperados",
      timeframe: "7 meses"
    }
  ]

  const blogPosts = Object.values(blogArticles).slice(0, 6)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Simular envio do formulário (aqui você pode integrar com sua API)
      console.log('Form submitted:', formData)
      
      // Mostrar mensagem de sucesso
      alert('Cadastro realizado com sucesso! Você será redirecionado para a plataforma.')
      
      // Limpar formulário
      setFormData({ nome: '', email: '', telefone: '', empresa: '', mensagem: '' })
      
      // Redirecionar para o SaaS após 1 segundo
      setTimeout(() => {
        window.open('https://9yhyi3czgnmd.manus.space/', '_blank')
      }, 1000)
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar formulário. Tente novamente.')
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Simular envio do formulário de cadastro
      console.log('Signup submitted:', signupFormData)
      
      // Mostrar mensagem de sucesso
      alert('Cadastro realizado com sucesso! Você será redirecionado para a plataforma.')
      
      // Fechar modal
      setShowSignupModal(false)
      
      // Limpar formulário
      setSignupFormData({ nome: '', email: '', telefone: '', empresa: '' })
      
      // Redirecionar para o SaaS após 1 segundo
      setTimeout(() => {
        window.open('https://9yhyi3czgnmd.manus.space/', '_blank')
      }, 1000)
      
    } catch (error) {
      console.error('Erro ao enviar cadastro:', error)
      alert('Erro ao enviar cadastro. Tente novamente.')
    }
  }

  const openSignupModal = () => {
    const pricingSection = document.getElementById("precos");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <>
      {selectedArticle ? (
        <BlogArticle 
          article={selectedArticle} 
          onBack={() => setSelectedArticle(null)} 
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ProtestoPro</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">Início</a>
            <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Como Funciona</a>
            <a href="#precos" className="text-gray-700 hover:text-blue-600 transition-colors">Preços</a>
            <a href="#blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</a>
          </nav>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={openSignupModal}
          >
            Começar Agora
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🚀 Recuperação de Crédito Inteligente
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Recupere Seus Créditos com
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              Eficiência Máxima
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa para automatizar e otimizar sua recuperação de crédito. 
            Aumente sua taxa de sucesso em até 68% com nossa tecnologia avançada.
          </p>
          
          {/* Estatísticas Hero */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">R$ 15.2M</div>
              <div className="text-gray-600">Recuperado</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">68%</div>
              <div className="text-gray-600">Taxa de Sucesso</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.847</div>
              <div className="text-gray-600">Clientes Ativos</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">45 dias</div>
              <div className="text-gray-600">Tempo Médio</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
              onClick={openSignupModal}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Recuperar Crédito Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-2"
              onClick={openSignupModal}
            >
              <Phone className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Gráficos de Recuperação */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">📊 Resultados Comprovados</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Números que Falam por Si
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Veja como nossa plataforma tem ajudado empresas a recuperar milhões em créditos em atraso
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Gráfico de Recuperação Mensal */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Recuperação Mensal (2024)
                </CardTitle>
                <CardDescription>Volume total recuperado por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recoveryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Recuperado']}
                        labelStyle={{ color: '#1f2937' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="url(#blueGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(recoveryData.reduce((sum, data) => sum + data.value, 0))}
                  </span>
                  <p className="text-gray-600">Total Recuperado em 2024</p>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Tipos de Protesto */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                  Tipos de Protesto Mais Eficazes
                </CardTitle>
                <CardDescription>Distribuição por tipo de documento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={protestTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {protestTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Participação']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-3">
                    {protestTypeData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-3" 
                            style={{ backgroundColor: COLORS[index] }}
                          ></div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">{item.value}%</div>
                          <div className="text-xs text-gray-600">{formatCurrency(item.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-600 font-semibold">Taxa de Sucesso: 68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Taxa de Sucesso ao Longo do Tempo */}
          <div className="mb-12">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-green-600" />
                  Evolução da Taxa de Sucesso
                </CardTitle>
                <CardDescription>Percentual de recuperação mensal ao longo de 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={successRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        domain={[50, 80]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Taxa de Sucesso']}
                        labelStyle={{ color: '#1f2937' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#10b981"
                        fill="url(#greenGradient)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">68%</div>
                    <div className="text-sm text-gray-600">Média Anual</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">74%</div>
                    <div className="text-sm text-gray-600">Melhor Mês</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">+12%</div>
                    <div className="text-sm text-gray-600">Melhoria Anual</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">⚡ Processo Simplificado</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona o ProtestoPro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Processo automatizado em 4 etapas simples para maximizar sua recuperação de crédito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Upload dos Títulos</h3>
              <p className="text-gray-600">
                Faça upload dos seus títulos em atraso de forma simples e segura em nossa plataforma
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Processamento Automático</h3>
              <p className="text-gray-600">
                Nossa IA analisa e processa automaticamente todos os documentos e dados necessários
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Protesto Estratégico</h3>
              <p className="text-gray-600">
                Executamos o protesto nos cartórios mais eficazes, seguindo as melhores práticas legais
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">4. Recuperação Eficaz</h3>
              <p className="text-gray-600">
                Acompanhe em tempo real o progresso e receba os valores recuperados diretamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estatística de Prazo de Protesto */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-100 text-red-800">⏰ Tempo é Dinheiro</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O Prazo Faz Toda a Diferença
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quanto mais rápido você protestar um título, maiores são suas chances de recuperação. 
              Veja como o tempo impacta diretamente seus resultados:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gráfico de Prazo vs Taxa de Recuperação */}
            <div>
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Clock className="w-6 h-6 mr-2 text-red-600" />
                    Taxa de Recuperação por Prazo
                  </CardTitle>
                  <CardDescription>Impacto do tempo na efetividade do protesto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { prazo: '0-30 dias', taxa: 85, label: '0-30 dias' },
                        { prazo: '31-60 dias', taxa: 72, label: '31-60 dias' },
                        { prazo: '61-90 dias', taxa: 58, label: '61-90 dias' },
                        { prazo: '91-180 dias', taxa: 45, label: '91-180 dias' },
                        { prazo: '180+ dias', taxa: 35, label: '180+ dias' }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          label={{ value: 'Taxa de Recuperação (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Taxa de Recuperação']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="taxa" 
                          stroke="#dc2626" 
                          fill="url(#colorGradient)"
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas Detalhadas */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-green-600">85%</h3>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Protesto em 0-30 dias</h4>
                <p className="text-gray-600">
                  Títulos protestados nos primeiros 30 dias têm a maior taxa de recuperação. 
                  <strong> Ação rápida = Resultado garantido!</strong>
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-yellow-600">72%</h3>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Protesto em 31-60 dias</h4>
                <p className="text-gray-600">
                  Ainda há boas chances de recuperação, mas cada dia que passa reduz suas possibilidades.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-red-600">35%</h3>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Protesto após 180 dias</h4>
                <p className="text-gray-600">
                  Títulos antigos têm chances muito reduzidas. 
                  <strong> Não deixe para depois!</strong>
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">💡 Dica Importante</h3>
                <p className="mb-4">
                  Com o ProtestoPro, você pode protestar títulos <strong>no mesmo dia</strong> do vencimento, 
                  maximizando suas chances de recuperação!
                </p>
                <Button 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={openSignupModal}
                >
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">⭐ Depoimentos</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empresas de todos os tamanhos confiam no ProtestoPro para recuperar seus créditos
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                      <div className="font-semibold text-gray-900 text-lg">
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-blue-600 font-medium">
                        {testimonials[activeTestimonial].role} - {testimonials[activeTestimonial].company}
                      </div>
                    </div>
                    <div className="flex gap-6 justify-center lg:justify-end">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {testimonials[activeTestimonial].results}
                        </div>
                        <div className="text-sm text-gray-600">Resultado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {testimonials[activeTestimonial].timeframe}
                        </div>
                        <div className="text-sm text-gray-600">Tempo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navegação dos depoimentos */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-blue-600 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Estatísticas dos clientes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.847</div>
                <div className="text-gray-600">Clientes Ativos</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="text-3xl font-bold text-green-600 mb-2">R$ 15.2M</div>
                <div className="text-gray-600">Recuperado em 2024</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="text-3xl font-bold text-purple-600 mb-2">68%</div>
                <div className="text-gray-600">Taxa Média de Sucesso</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Satisfação do Cliente</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">💰 Preços Transparentes</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Investimento que se Paga
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para seu negócio. Você só paga quando recuperamos seu crédito
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Plano Básico */}
            <Card className="p-8 bg-white shadow-2xl border-0 relative">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-blue-100 text-blue-800">Plano 1 – Básico</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ideal para autônomos, MEIs e escritórios pequenos
                </h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    R$ 19,90<span className="text-lg text-gray-600">/mês</span>
                  </div>
                  <div className="text-lg text-gray-600">+ 5% sobre títulos pagos</div>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-block mb-6">
                  Você só paga quando recuperamos!
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>30 apontamentos</strong> de títulos por mês</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Upload de até <strong>3 tipos de títulos</strong> por vez: CH, NP, CC, CT, DM, DMI, DSI...</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Geração automática da <strong>carta de anuência</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Envio de título para cartório <strong>(via CENPROT/CRA)</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suporte via <strong>e-mail</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Assinatura digital via <strong>Gov.br</strong> (limite 1/mês)</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>🔒 Cobrança de <strong>5%</strong> sobre valores recebidos com sucesso</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                onClick={openSignupModal}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Começar com Básico
              </Button>
            </Card>

            {/* Plano Profissional */}
            <Card className="p-8 bg-white shadow-2xl border-0 relative border-2 border-purple-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-6 py-2">Mais Popular</Badge>
              </div>
              
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-purple-100 text-purple-800">Plano 2 – Profissional</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ideal para empresas com cobrança recorrente
                </h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    R$ 39,90<span className="text-lg text-gray-600">/mês</span>
                  </div>
                  <div className="text-lg text-gray-600">+ 3% sobre títulos pagos</div>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-block mb-6">
                  Você só paga quando recuperamos!
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>30 apontamentos</strong> por mês</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Todos os tipos de títulos</strong> suportados: CH, NP, SJ, CT, CC, DM, DMI, DSI</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Análise automática de <strong>validade jurídica</strong> dos títulos</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Geração de carta de anuência com <strong>personalização</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Envio automático aos cartórios via <strong>integração CRA/CENPROT</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Painel com <strong>histórico, relatórios e dashboard</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suporte via <strong>WhatsApp e e-mail</strong></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Assinatura digital <strong>ilimitada</strong> via Gov.br ou ICP-Brasil</span>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>🔒 Cobrança de <strong>3%</strong> sobre valores recebidos com sucesso</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                onClick={openSignupModal}
              >
                <Zap className="w-5 h-5 mr-2" />
                Começar com Profissional
              </Button>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Sem taxa de setup • Sem fidelidade • Cancele quando quiser
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Ativação Imediata</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Suporte Especializado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">📚 Blog</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Conteúdo Especializado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Artigos, guias e dicas para otimizar sua estratégia de recuperação de crédito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogArticles.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => setSelectedArticle(article)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Por {article.author}</span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Ler Artigo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2">
              Ver Todos os Artigos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 px-4 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white">📞 Contato</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Fale com Nossa Equipe
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos prontos para ajudar você a recuperar seus créditos. Entre em contato conosco!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h3 className="text-2xl font-semibold mb-8">Informações de Contato</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-300 mr-4" />
                  <div>
                    <div className="font-semibold">Telefone</div>
                    <div className="text-blue-100">(11) 3000-0000</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 text-blue-300 mr-4" />
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-blue-100">(11) 99999-9999</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-300 mr-4" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-blue-100">contato@protestopro.com.br</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-300 mr-4" />
                  <div>
                    <div className="font-semibold">Endereço</div>
                    <div className="text-blue-100">São Paulo, SP - Brasil</div>
                  </div>
                </div>
              </div>

              {/* Redes Sociais */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Siga-nos nas Redes Sociais</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Envie uma Mensagem</CardTitle>
                  <CardDescription className="text-blue-100">
                    Preencha o formulário e entraremos em contato em até 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Seu email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                      />
                      <Input
                        placeholder="Empresa"
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                      />
                    </div>
                    <Textarea
                      placeholder="Sua mensagem"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-32"
                      required
                    />
                    <Button type="submit" className="w-full bg-white text-blue-900 hover:bg-blue-50">
                      Cadastrar e Acessar Plataforma
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ProtestoPro</span>
              </div>
              <p className="text-gray-400 mb-4">
                A plataforma mais eficiente para recuperação de crédito do Brasil.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demonstração</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guias</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cases de Sucesso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ProtestoPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Cadastro */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cadastre-se no ProtestoPro</h2>
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label htmlFor="signup-nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    id="signup-nome"
                    type="text"
                    value={signupFormData.nome}
                    onChange={(e) => setSignupFormData({...signupFormData, nome: e.target.value})}
                    required
                    className="w-full"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupFormData.email}
                    onChange={(e) => setSignupFormData({...signupFormData, email: e.target.value})}
                    required
                    className="w-full"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="signup-telefone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <Input
                    id="signup-telefone"
                    type="tel"
                    value={signupFormData.telefone}
                    onChange={(e) => setSignupFormData({...signupFormData, telefone: e.target.value})}
                    required
                    className="w-full"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label htmlFor="signup-empresa" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa *
                  </label>
                  <Input
                    id="signup-empresa"
                    type="text"
                    value={signupFormData.empresa}
                    onChange={(e) => setSignupFormData({...signupFormData, empresa: e.target.value})}
                    required
                    className="w-full"
                    placeholder="Nome da sua empresa"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>🎉 Oferta Especial:</strong> Primeiros 30 dias grátis + suporte dedicado para novos clientes!
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSignupModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Cadastrar e Acessar
                  </Button>
                </div>
              </form>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
