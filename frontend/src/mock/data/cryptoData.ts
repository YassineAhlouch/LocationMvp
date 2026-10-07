/* eslint-disable @typescript-eslint/no-explicit-any */
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

const generateSparklineData = (
    basePrice: number,
    volatility: number = 0.1,
    seed?: number,
): number[] => {
    const actualSeed = seed ?? Math.floor(basePrice * 1000)
    const points = 20
    const data: number[] = []

    let currentPrice = basePrice * (0.5 + seededRandom(actualSeed) * 1.0)

    for (let i = 0; i < points; i++) {
        let priceChange = 0

        const baseVolatility = volatility * 4

        priceChange +=
            (seededRandom(actualSeed + i * 7) - 0.5) *
            baseVolatility *
            currentPrice

        if (i > 1 && seededRandom(actualSeed + i * 11) < 0.4) {
            const recentTrend = data[i - 1] - data[i - 2]
            priceChange +=
                recentTrend * (0.4 + seededRandom(actualSeed + i * 13) * 0.6)
        }

        if (seededRandom(actualSeed + i * 17) < 0.3) {
            const isSpike = seededRandom(actualSeed + i * 19) < 0.5
            const magnitude = 0.2 + seededRandom(actualSeed + i * 23) * 0.4
            priceChange += currentPrice * magnitude * (isSpike ? 1 : -1)
        }

        priceChange +=
            (seededRandom(actualSeed + i * 29) - 0.5) *
            baseVolatility *
            currentPrice *
            0.8

        currentPrice += priceChange

        currentPrice = Math.max(currentPrice, basePrice * 0.2)
        currentPrice = Math.min(currentPrice, basePrice * 3.5)

        data.push(currentPrice)
    }

    const finalAdjustment = (basePrice - data[points - 1]) * 0.5
    data[points - 1] += finalAdjustment

    for (let i = Math.max(0, points - 4); i < points - 1; i++) {
        const targetPrice =
            basePrice + (data[i] - basePrice) * (0.8 - (points - 1 - i) * 0.15)
        data[i] = data[i] * 0.6 + targetPrice * 0.4
    }

    return data
}

const getCryptoImage = (symbol: string): string => {
    return `/img/thumbs/crypto/${symbol.toLowerCase()}.png`
}

const generateCoinDescription = (name: string, symbol: string): string => {
    const templates = [
        `<div class="coin-description">
            <p>${name} (${symbol}) represents a revolutionary advancement in blockchain technology and digital asset management, embodying the next evolution of decentralized systems. Built upon a sophisticated foundation of advanced cryptographic principles and cutting-edge consensus mechanisms, this cryptocurrency delivers unparalleled network security, transaction integrity, and truly decentralized governance. The platform emerges as a comprehensive solution to the challenges facing traditional financial systems, offering users complete control over their digital assets while participating in a global, trustless network. Through its innovative approach to blockchain architecture, ${name} addresses critical issues such as scalability bottlenecks, energy consumption concerns, and user accessibility barriers that have historically limited widespread cryptocurrency adoption. The network's design philosophy centers on creating a sustainable, efficient, and user-friendly ecosystem that can serve as the backbone for the next generation of decentralized applications and financial services.</p>
            <br>
            <h6>Core Technology</h6>
            <p>The ${name} network utilizes sophisticated blockchain architecture designed to address the trilemma of scalability, security, and decentralization. Through innovative consensus algorithms and optimized data structures, the platform achieves high throughput while maintaining the trustless nature that makes blockchain technology revolutionary. The network's design incorporates advanced features such as smart contract functionality, cross-chain interoperability, and energy-efficient validation mechanisms.</p>
            
            <p>Transaction processing on the ${name} network is optimized for both speed and cost-effectiveness. The platform employs various scaling solutions including layer-2 protocols, sharding techniques, and off-chain computation to handle increasing transaction volumes without compromising security or decentralization. This multi-layered approach ensures that users can enjoy fast, reliable, and affordable transactions regardless of network congestion.</p>
            <br>
            
            <h6>Economic Model and Tokenomics</h6>
            <p>The ${symbol} token serves multiple functions within the ecosystem, acting as a medium of exchange, store of value, and governance token. The carefully designed tokenomics model includes mechanisms for inflation control, staking rewards, and network fee distribution. Token holders can participate in network governance through voting on protocol upgrades, parameter changes, and community proposals.</p>
            
            <p>The economic incentive structure is designed to align the interests of all network participants, including validators, developers, and users. Through a combination of transaction fees, staking rewards, and governance incentives, the network maintains a sustainable economic model that encourages long-term participation and network growth.</p>
            <br>
            
            <h6>Use Cases and Applications</h6>
            <p>The ${name} platform supports a wide range of applications across various industries. From decentralized finance (DeFi) protocols to non-fungible tokens (NFTs), gaming applications, and enterprise solutions, the network provides the infrastructure necessary for building next-generation decentralized applications. The platform's flexibility and programmability make it suitable for both simple peer-to-peer transactions and complex multi-party smart contracts.</p>
            
            <p>Developers can leverage the platform's comprehensive toolkit to build innovative applications that take advantage of blockchain's unique properties. The network supports various programming languages and development frameworks, making it accessible to developers with different backgrounds and expertise levels. Additionally, the platform provides extensive documentation, developer tools, and community support to facilitate the creation of robust decentralized applications.</p>
            <br>
            
            <h6>Security and Decentralization</h6>
            <p>Security is paramount in the ${name} network design. The platform employs multiple layers of security measures, including cryptographic hashing, digital signatures, and consensus-based validation. Regular security audits and bug bounty programs help identify and address potential vulnerabilities before they can be exploited.</p>
            
            <p>The network's decentralized nature ensures that no single entity has control over the platform. Validators are distributed globally, and the consensus mechanism requires broad agreement before any changes can be implemented. This decentralized approach provides resilience against censorship, single points of failure, and malicious attacks.</p>
            <br>
            
            <h6>Community and Ecosystem</h6>
            <p>The ${name} community plays a crucial role in the platform's development and governance. Through various communication channels, forums, and social media platforms, community members collaborate on protocol improvements, share knowledge, and support new users. The ecosystem includes developers, validators, investors, and users who all contribute to the network's growth and success.</p>
            
            <p>Regular community events, hackathons, and educational initiatives help foster innovation and adoption. The platform's open-source nature encourages community contributions and ensures transparency in development processes. This collaborative approach has led to numerous improvements and innovations that benefit the entire ecosystem.</p>
        </div>`,

        `<div class="coin-description">
            <p>${name} (${symbol}) stands at the forefront of the global financial revolution, representing a fundamental paradigm shift toward decentralized finance and autonomous economic systems that operate without traditional intermediaries. This groundbreaking cryptocurrency embodies the core principles of financial sovereignty and economic freedom, enabling users worldwide to maintain complete control over their digital assets while participating in an open, permissionless, and globally accessible financial network. The platform serves as a catalyst for financial inclusion, breaking down barriers that have historically excluded billions of people from accessing basic financial services. Through its innovative approach to monetary systems, ${name} challenges conventional banking models by offering transparent, programmable, and censorship-resistant financial infrastructure. The network's design prioritizes user empowerment, providing individuals and institutions with the tools necessary to create, manage, and transfer value without relying on centralized authorities or traditional financial gatekeepers.</p>
            <br>
            <h6>Decentralized Finance Revolution</h6>
            <p>The ${name} ecosystem serves as a cornerstone of the decentralized finance movement, providing the infrastructure necessary for creating and operating financial services without traditional intermediaries. The platform supports various DeFi protocols including decentralized exchanges, lending platforms, yield farming opportunities, and liquidity mining programs.</p>
            
            <p>Users can participate in sophisticated financial strategies previously available only to institutional investors. Through smart contracts and automated market makers, the platform enables efficient price discovery, liquidity provision, and risk management. The composability of DeFi protocols allows users to combine different services to create complex financial products and strategies.</p>
            <br>
            
            <h6>Monetary Policy and Inflation Hedge</h6>
            <p>The ${symbol} token is designed with a predictable monetary policy that provides transparency and certainty for long-term holders. Unlike traditional fiat currencies subject to arbitrary monetary policy changes, the token's supply schedule is governed by algorithmic rules embedded in the protocol. This predictability makes it an attractive store of value and potential hedge against inflation.</p>
            
            <p>The network's monetary policy includes mechanisms for controlling inflation while ensuring adequate liquidity for network operations. Through careful balance of token issuance, burning mechanisms, and staking rewards, the platform maintains price stability while incentivizing network participation and security.</p>
            <br>
            
            <h6>Cross-Border Payments and Remittances</h6>
            <p>One of the most significant advantages of the ${name} network is its ability to facilitate fast, low-cost cross-border transactions. Traditional international money transfers often involve multiple intermediaries, high fees, and lengthy settlement times. The ${name} network eliminates these inefficiencies by enabling direct peer-to-peer transfers across borders.</p>
            
            <p>The platform's global accessibility makes it particularly valuable for remittances and international commerce. Users can send and receive payments 24/7 without relying on traditional banking infrastructure. This capability is especially important for underbanked populations and regions with limited access to traditional financial services.</p>
            <br>
            
            <h6>Institutional Adoption and Integration</h6>
            <p>The ${name} platform has gained significant traction among institutional investors and enterprises seeking to leverage blockchain technology for various use cases. The network's robust infrastructure, regulatory compliance features, and enterprise-grade security make it suitable for institutional adoption.</p>
            
            <p>Financial institutions are increasingly integrating ${symbol} into their operations for treasury management, cross-border payments, and customer services. The platform's programmability allows institutions to create custom solutions that meet their specific requirements while maintaining compliance with regulatory frameworks.</p>
            <br>
            
            <h6>Environmental Sustainability</h6>
            <p>Environmental consciousness is a key consideration in the ${name} network design. The platform employs energy-efficient consensus mechanisms that significantly reduce the environmental impact compared to traditional proof-of-work systems. This commitment to sustainability aligns with growing environmental awareness and regulatory requirements.</p>
            
            <p>The network's carbon footprint is continuously monitored and optimized through various initiatives including renewable energy adoption, carbon offset programs, and efficiency improvements. This focus on sustainability ensures that the platform can scale globally while minimizing environmental impact.</p>
            <br>
            
            <h6>Future Roadmap and Development</h6>
            <p>The ${name} development roadmap includes ambitious plans for scaling, feature enhancement, and ecosystem expansion. Upcoming developments focus on improving user experience, increasing transaction throughput, and expanding interoperability with other blockchain networks.</p>
            
            <p>Research and development efforts continue to push the boundaries of what's possible with blockchain technology. The team is actively working on innovations in areas such as privacy preservation, quantum resistance, and advanced smart contract capabilities. These developments ensure that the platform remains at the cutting edge of blockchain technology.</p>
        </div>`,

        `<div class="coin-description">
            <p>${name} (${symbol}) represents a comprehensive and sophisticated blockchain ecosystem meticulously designed to support the next generation of decentralized applications, digital services, and innovative technological solutions. This advanced platform seamlessly combines cutting-edge blockchain technology with practical, real-world utility, creating an exceptionally robust and versatile foundation for building, deploying, and scaling various blockchain-based solutions across multiple industries and use cases. The network's architecture reflects years of research and development in distributed systems, cryptography, and economic theory, resulting in a platform that addresses the complex challenges facing modern digital infrastructure. Through its innovative approach to blockchain design, ${name} enables developers, enterprises, and users to harness the full potential of decentralized technology while maintaining the performance, security, and usability standards required for mainstream adoption. The platform's commitment to interoperability, scalability, and user experience positions it as a leading solution in the rapidly evolving blockchain landscape.</p>
            <br>
            <h6>Platform Architecture and Scalability</h6>
            <p>The ${name} network is built on a modular architecture that allows for continuous improvement and adaptation to changing requirements. The platform's design separates consensus, execution, and data availability layers, enabling independent optimization of each component. This modular approach provides flexibility for future upgrades while maintaining backward compatibility.</p>
            
            <p>Scalability is achieved through a combination of innovative techniques including parallel processing, optimistic execution, and advanced data compression. The network can handle thousands of transactions per second while maintaining low latency and reasonable fees. This high-performance capability makes the platform suitable for applications requiring real-time processing and high throughput.</p>
            <br>
            
            <h6>Developer Ecosystem and Tools</h6>
            <p>The ${name} platform provides a comprehensive suite of developer tools and resources designed to simplify the creation of decentralized applications. The development environment includes integrated development environments (IDEs), testing frameworks, deployment tools, and extensive documentation. These resources enable developers to build, test, and deploy applications efficiently.</p>
            
            <p>The platform supports multiple programming languages and development paradigms, making it accessible to developers with various backgrounds. Smart contract development is streamlined through high-level programming languages that compile to efficient bytecode. Additionally, the platform provides libraries and frameworks that abstract complex blockchain operations, allowing developers to focus on application logic.</p>
            <br>
            
            <h6>Interoperability and Cross-Chain Functionality</h6>
            <p>Interoperability is a core feature of the ${name} network, enabling seamless communication and asset transfer between different blockchain networks. The platform implements various bridging protocols and cross-chain communication standards that allow users to move assets and data across different ecosystems.</p>
            
            <p>This cross-chain functionality opens up new possibilities for decentralized applications that can leverage features and assets from multiple blockchain networks. Users benefit from increased liquidity, expanded functionality, and access to a broader range of services and applications.</p>
            <br>
            
            <h6>Governance and Community Participation</h6>
            <p>The ${name} network employs a sophisticated governance system that enables token holders to participate in decision-making processes. The governance framework includes proposal submission, voting mechanisms, and implementation procedures that ensure community input is reflected in network development.</p>
            
            <p>Community governance extends beyond technical decisions to include funding allocation, partnership approvals, and strategic direction setting. This democratic approach ensures that the network evolves in alignment with community interests and values. Regular governance activities keep the community engaged and invested in the platform's success.</p>
            <br>
            
            <h6>Privacy and Security Features</h6>
            <p>Privacy protection is built into the ${name} network through various cryptographic techniques and privacy-preserving protocols. Users can choose their desired level of privacy for different transactions and interactions. The platform supports both transparent and private transactions, giving users flexibility in how they manage their financial privacy.</p>
            
            <p>Security measures include multi-signature support, time-locked transactions, and advanced access control mechanisms. The network undergoes regular security audits and maintains bug bounty programs to identify and address potential vulnerabilities. These comprehensive security measures protect user funds and ensure network integrity.</p>
            <br>
            
            <h6>Real-World Applications and Partnerships</h6>
            <p>The ${name} platform has found applications across various industries including supply chain management, digital identity, healthcare, and entertainment. Real-world use cases demonstrate the practical value of blockchain technology and drive mainstream adoption.</p>
            
            <p>Strategic partnerships with enterprises, governments, and other blockchain projects expand the platform's reach and utility. These collaborations bring real-world requirements and use cases that drive platform development and improvement. The growing ecosystem of partners and applications creates network effects that benefit all participants.</p>
            <br>
            
            <h6>Market Position and Competitive Advantages</h6>
            <p>In the competitive blockchain landscape, ${name} distinguishes itself through a combination of technical innovation, community focus, and practical utility. The platform's unique features and capabilities position it well for long-term success in the evolving cryptocurrency market.</p>
            
            <p>Continuous innovation and adaptation ensure that the platform remains competitive and relevant as the blockchain industry evolves. The team's commitment to excellence and community-driven development creates a sustainable foundation for future growth and success.</p>
        </div>`,
    ]

    const randomIndex =
        Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) %
        templates.length
    return templates[randomIndex]
}

const generateChartData = (
    basePrice: number,
    timeRange: string,
    seed: number = 54321,
) => {
    const now = Date.now()
    let points: number
    let interval: number

    switch (timeRange) {
        case '1h':
            points = 60
            interval = 60 * 1000
            break
        case '24h':
            points = 24
            interval = 60 * 60 * 1000
            break
        case '7d':
            points = 7
            interval = 24 * 60 * 60 * 1000
            break
        case '30d':
            points = 30
            interval = 24 * 60 * 60 * 1000
            break
        case '1y':
            points = 52
            interval = 7 * 24 * 60 * 60 * 1000
            break
        case 'YTD': {
            points = 365
            interval = 24 * 60 * 60 * 1000
            break
        }
        case 'ALL':
            points = 60
            interval = 30 * 24 * 60 * 60 * 1000
            break
        default:
            points = 24
            interval = 60 * 60 * 1000
    }

    const data: {
        timestamp: number
        price: number
        volume?: number
        high?: number
        low?: number
        open?: number
        close?: number
    }[] = []
    let currentPrice = basePrice

    for (let i = points; i >= 0; i--) {
        const timestamp = now - i * interval

        const volatility =
            timeRange === '1h' ? 0.01 : timeRange === '24h' ? 0.03 : 0.06

        const gapSize = (seededRandom(seed + i * 3) - 0.5) * volatility * 0.2
        const open = currentPrice * (1 + gapSize)

        const bodySize = (seededRandom(seed + i * 5) - 0.5) * volatility * 2
        const close = open + bodySize * currentPrice

        const range = Math.abs(close - open)
        const wickSize = range * (0.5 + seededRandom(seed + i * 7) * 1.5)

        const high =
            Math.max(open, close) + seededRandom(seed + i * 11) * wickSize
        const low =
            Math.min(open, close) - seededRandom(seed + i * 13) * wickSize

        const volume = seededRandom(seed + i * 17) * 1000000 + 500000

        currentPrice = close

        data.push({
            timestamp,
            price: currentPrice,
            volume,
            high,
            low,
            open,
            close,
        })
    }

    return data
}

export type ChartTimeRange =
    | '1m'
    | '5m'
    | '15m'
    | '1h'
    | '4h'
    | '1d'
    | '24h'
    | '7d'
    | '30d'
    | '1y'
    | 'YTD'
    | 'ALL'

export type SpotTradingData = {
    pair: string
    price: number
    priceChange24h: number
    priceChangePercentage24h: number
    indexPrice: number
    high24h: number
    low24h: number
    volume24h: number
    baseAsset: string
    quoteAsset: string
    lastUpdate: number
}

export type OrderBookEntry = {
    price: number
    amount: number
    total: number
}

export type OrderBookData = {
    bids: OrderBookEntry[]
    asks: OrderBookEntry[]
    lastUpdate: number
}

export type TradeExecution = {
    id: string
    price: number
    amount: number
    timestamp: number
    side: 'buy' | 'sell'
    total: number
}

export type SpotMarketData = {
    pair: string
    baseAsset: string
    quoteAsset: string
    price: number
    change24h: number
    changePercentage24h: number
    volume24h: number
    leverage?: string
}

const generateOrderBook = (
    basePrice: number,
    spread: number = 0.001,
    seed: number = 11111,
): OrderBookData => {
    const bids: OrderBookEntry[] = []
    const asks: OrderBookEntry[] = []

    let cumulativeTotal = 0
    for (let i = 0; i < 15; i++) {
        const priceOffset =
            (seededRandom(seed + i * 3) * 0.02 + spread) * (i + 1)
        const price = basePrice * (1 - priceOffset)
        const amount = seededRandom(seed + i * 5) * 5 + 0.1
        cumulativeTotal += price * amount

        bids.push({
            price,
            amount,
            total: cumulativeTotal,
        })
    }

    cumulativeTotal = 0
    for (let i = 0; i < 15; i++) {
        const priceOffset =
            (seededRandom(seed + i * 7 + 100) * 0.02 + spread) * (i + 1)
        const price = basePrice * (1 + priceOffset)
        const amount = seededRandom(seed + i * 11 + 100) * 5 + 0.1
        cumulativeTotal += price * amount

        asks.push({
            price,
            amount,
            total: cumulativeTotal,
        })
    }

    return {
        bids: bids.sort((a, b) => b.price - a.price),
        asks: asks.sort((a, b) => a.price - b.price),
        lastUpdate: Date.now(),
    }
}

const generateTradeExecutions = (
    basePrice: number,
    count: number = 50,
    seed: number = 22222,
): TradeExecution[] => {
    const trades: TradeExecution[] = []
    const now = Date.now()

    for (let i = 0; i < count; i++) {
        const timestamp = now - seededRandom(seed + i * 3) * 3600000
        const side = seededRandom(seed + i * 5) > 0.5 ? 'buy' : 'sell'
        const priceVariation = (seededRandom(seed + i * 7) - 0.5) * 0.01
        const price = basePrice * (1 + priceVariation)
        const amount = seededRandom(seed + i * 11) * 2 + 0.01

        trades.push({
            id: `trade-${i + 1}`,
            price,
            amount,
            timestamp,
            side,
            total: price * amount,
        })
    }

    return trades.sort((a, b) => b.timestamp - a.timestamp)
}

const generateSpotChartData = (
    basePrice: number,
    timeRange: ChartTimeRange,
) => {
    const now = Date.now()
    let points: number
    let interval: number

    switch (timeRange) {
        case '1m':
            points = 60
            interval = 60 * 1000
            break
        case '5m':
            points = 60
            interval = 5 * 60 * 1000
            break
        case '15m':
            points = 60
            interval = 15 * 60 * 1000
            break
        case '1h':
            points = 60
            interval = 60 * 60 * 1000
            break
        case '4h':
            points = 60
            interval = 4 * 60 * 60 * 1000
            break
        case '1d':
            points = 30
            interval = 24 * 60 * 60 * 1000
            break
        case '24h':
            points = 24
            interval = 60 * 60 * 1000
            break
        case '7d':
            points = 7
            interval = 24 * 60 * 60 * 1000
            break
        case '30d':
            points = 30
            interval = 24 * 60 * 60 * 1000
            break
        case '1y':
            points = 52
            interval = 7 * 24 * 60 * 60 * 1000
            break
        case 'YTD': {
            const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime()
            points = Math.ceil((now - yearStart) / (24 * 60 * 60 * 1000))
            interval = 24 * 60 * 60 * 1000
            break
        }
        case 'ALL':
            points = 60
            interval = 30 * 24 * 60 * 60 * 1000
            break
        default:
            points = 24
            interval = 60 * 60 * 1000
    }

    const data: {
        timestamp: number
        price: number
        volume?: number
        high?: number
        low?: number
        open?: number
        close?: number
    }[] = []
    let currentPrice = basePrice

    for (let i = points; i >= 0; i--) {
        const timestamp = now - i * interval

        const volatility =
            timeRange === '1m' || timeRange === '5m' || timeRange === '15m'
                ? 0.005
                : timeRange === '1h' || timeRange === '4h'
                  ? 0.01
                  : timeRange === '24h'
                    ? 0.03
                    : 0.06

        const gapSize = (Math.random() - 0.5) * volatility * 0.2
        const open = currentPrice * (1 + gapSize)

        const bodySize = (Math.random() - 0.5) * volatility * 2
        const close = open + bodySize * currentPrice

        const range = Math.abs(close - open)
        const wickSize = range * (0.5 + Math.random() * 1.5)

        const high = Math.max(open, close) + Math.random() * wickSize
        const low = Math.min(open, close) - Math.random() * wickSize

        const volume = Math.random() * 1000000 + 500000

        currentPrice = close

        data.push({
            timestamp,
            price: currentPrice,
            volume,
            high,
            low,
            open,
            close,
        })
    }

    return data
}

const generateNewsArticles = (
    coinName: string,
    symbol: string,
): {
    id: string
    title: string
    excerpt: string
    publishedAt: string
    source: string
    url: string
    imageUrl?: string
}[] => {
    const newsTemplates = [
        {
            title: `${coinName} Reaches New Technical Milestone`,
            excerpt: `The ${coinName} network has successfully implemented major upgrades that enhance scalability and security...`,
            source: 'CryptoNews',
        },
        {
            title: `Market Analysis: ${symbol} Shows Strong Performance`,
            excerpt: `Recent market data indicates ${coinName} has outperformed expectations with increased trading volume...`,
            source: 'CoinDesk',
        },
        {
            title: `${coinName} Partnership Announcement Drives Adoption`,
            excerpt: `Strategic partnerships are expanding ${coinName}'s ecosystem and bringing new use cases to the platform...`,
            source: 'Cointelegraph',
        },
        {
            title: `Developer Activity Surges on ${coinName} Network`,
            excerpt: `GitHub metrics show increased developer engagement and new project deployments on the ${coinName} blockchain...`,
            source: 'The Block',
        },
        {
            title: `${symbol} Technical Analysis: Key Levels to Watch`,
            excerpt: `Technical indicators suggest ${coinName} is approaching critical support and resistance levels...`,
            source: 'CryptoSlate',
        },
    ]

    return newsTemplates.map((template, index) => ({
        id: `${symbol.toLowerCase()}-news-${index + 1}`,
        title: template.title,
        excerpt: template.excerpt,
        publishedAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        source: template.source,
        url: 'https://example.com',
        imageUrl: `/img/news/${symbol.toLowerCase()}-${index + 1}.jpg`,
    }))
}

export const cryptoMarketData = [
    {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        image: getCryptoImage('BTC'),
        price: 97234.56,
        priceChange24h: 1234.56,
        priceChangePercentage24h: 2.81,
        priceChangePercentage30d: 15.42,
        marketCap: 885000000000,
        volume24h: 28500000000,
        circulatingSupply: 19600000,
        sparklineData: generateSparklineData(115971.99, 0.15),
        marketType: 'all',
        rank: 1,
    },
    {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        image: getCryptoImage('ETH'),
        price: 3456.78,
        priceChange24h: -89.23,
        priceChangePercentage24h: -3.04,
        priceChangePercentage30d: 8.76,
        marketCap: 342000000000,
        volume24h: 15200000000,
        circulatingSupply: 120200000,
        sparklineData: generateSparklineData(4471.4, 0.2),
        marketType: 'all',
        rank: 2,
    },
    {
        id: '3',
        symbol: 'BNB',
        name: 'BNB',
        image: getCryptoImage('BNB'),
        price: 695.42,
        priceChange24h: 15.67,
        priceChangePercentage24h: 5.27,
        priceChangePercentage30d: 12.34,
        marketCap: 48000000000,
        volume24h: 1800000000,
        circulatingSupply: 153000000,
        sparklineData: generateSparklineData(312.89, 0.06),
        marketType: 'spot',
        rank: 3,
    },
    {
        id: '4',
        symbol: 'SOL',
        name: 'Solana',
        image: getCryptoImage('SOL'),
        price: 189.45,
        priceChange24h: 7.23,
        priceChangePercentage24h: 7.92,
        priceChangePercentage30d: 25.67,
        marketCap: 45000000000,
        volume24h: 2100000000,
        circulatingSupply: 456000000,
        sparklineData: generateSparklineData(238.01, 0.25),
        marketType: 'spot',
        rank: 4,
    },
    {
        id: '5',
        symbol: 'XRP',
        name: 'XRP',
        image: getCryptoImage('XRP'),
        price: 2.18,
        priceChange24h: -0.0234,
        priceChangePercentage24h: -4.28,
        priceChangePercentage30d: -2.15,
        marketCap: 29000000000,
        volume24h: 1200000000,
        circulatingSupply: 55400000000,
        sparklineData: generateSparklineData(0.5234, 0.15),
        marketType: 'all',
        rank: 5,
    },
    {
        id: '6',
        symbol: 'DOGE',
        name: 'Dogecoin',
        image: getCryptoImage('DOGE'),
        price: 0.3245,
        priceChange24h: 0.0045,
        priceChangePercentage24h: 6.05,
        priceChangePercentage30d: 18.92,
        marketCap: 11500000000,
        volume24h: 890000000,
        circulatingSupply: 145800000000,
        sparklineData: generateSparklineData(0.0789, 0.35),
        marketType: 'spot',
        rank: 6,
    },
    {
        id: '7',
        symbol: 'ADA',
        name: 'Cardano',
        image: getCryptoImage('ADA'),
        price: 0.8934,
        priceChange24h: -0.0123,
        priceChangePercentage24h: -3.44,
        priceChangePercentage30d: 5.67,
        marketCap: 12300000000,
        volume24h: 456000000,
        circulatingSupply: 35600000000,
        sparklineData: generateSparklineData(0.3456, 0.14),
        marketType: 'all',
        rank: 7,
    },
    {
        id: '8',
        symbol: 'AVAX',
        name: 'Avalanche',
        image: getCryptoImage('AVAX'),
        price: 42.67,
        priceChange24h: 2.34,
        priceChangePercentage24h: 9.17,
        priceChangePercentage30d: 22.45,
        marketCap: 11200000000,
        volume24h: 678000000,
        circulatingSupply: 401000000,
        sparklineData: generateSparklineData(27.89, 0.22),
        marketType: 'futures',
        rank: 8,
    },
    {
        id: '9',
        symbol: 'SHIB',
        name: 'Shiba Inu',
        image: getCryptoImage('SHIB'),
        price: 0.00002156,
        priceChange24h: 0.000000567,
        priceChangePercentage24h: 7.39,
        priceChangePercentage30d: 15.23,
        marketCap: 4850000000,
        volume24h: 234000000,
        circulatingSupply: 589000000000000,
        sparklineData: generateSparklineData(0.000008234, 0.4),
        marketType: 'spot',
        rank: 9,
    },
    {
        id: '10',
        symbol: 'DOT',
        name: 'Polkadot',
        image: getCryptoImage('DOT'),
        price: 7.23,
        priceChange24h: -0.23,
        priceChangePercentage24h: -3.89,
        priceChangePercentage30d: 1.45,
        marketCap: 7800000000,
        volume24h: 189000000,
        circulatingSupply: 1375000000,
        sparklineData: generateSparklineData(5.67, 0.13),
        marketType: 'futures',
        rank: 10,
    },
    {
        id: '11',
        symbol: 'LINK',
        name: 'Chainlink',
        image: getCryptoImage('LINK'),
        price: 23.45,
        priceChange24h: 0.89,
        priceChangePercentage24h: 6.68,
        priceChangePercentage30d: 19.87,
        marketCap: 8900000000,
        volume24h: 567000000,
        circulatingSupply: 626000000,
        sparklineData: generateSparklineData(14.23, 0.15),
        marketType: 'all',
        rank: 11,
    },
    {
        id: '12',
        symbol: 'MATIC',
        name: 'Polygon',
        image: getCryptoImage('MATIC'),
        price: 0.4567,
        priceChange24h: 0.0567,
        priceChangePercentage24h: 6.77,
        priceChangePercentage30d: 14.56,
        marketCap: 8200000000,
        volume24h: 345000000,
        circulatingSupply: 9170000000,
        sparklineData: generateSparklineData(0.8945, 0.15),
        marketType: 'spot',
        rank: 12,
    },
    {
        id: '13',
        symbol: 'UNI',
        name: 'Uniswap',
        image: getCryptoImage('UNI'),
        price: 12.34,
        priceChange24h: -0.34,
        priceChangePercentage24h: -4.78,
        priceChangePercentage30d: 7.89,
        marketCap: 5100000000,
        volume24h: 123000000,
        circulatingSupply: 752000000,
        sparklineData: generateSparklineData(6.78, 0.17),
        marketType: 'futures',
        rank: 13,
    },
    {
        id: '14',
        symbol: 'LTC',
        name: 'Litecoin',
        image: getCryptoImage('LTC'),
        price: 106.78,
        priceChange24h: 3.21,
        priceChangePercentage24h: 3.72,
        priceChangePercentage30d: 9.34,
        marketCap: 6700000000,
        volume24h: 456000000,
        circulatingSupply: 74900000,
        sparklineData: generateSparklineData(89.45, 0.12),
        marketType: 'all',
        rank: 14,
    },
    {
        id: '15',
        symbol: 'ATOM',
        name: 'Cosmos',
        image: getCryptoImage('ATOM'),
        price: 7.89,
        priceChange24h: 0.45,
        priceChangePercentage24h: 6.05,
        priceChangePercentage30d: 12.67,
        marketCap: 3100000000,
        volume24h: 89000000,
        circulatingSupply: 393000000,
        sparklineData: generateSparklineData(7.89, 0.14),
        marketType: 'spot',
        rank: 15,
    },
    {
        id: '16',
        symbol: 'NEAR',
        name: 'NEAR Protocol',
        image: getCryptoImage('NEAR'),
        price: 5.89,
        priceChange24h: 0.23,
        priceChangePercentage24h: 5.31,
        priceChangePercentage30d: 18.45,
        marketCap: 4900000000,
        volume24h: 167000000,
        circulatingSupply: 1074000000,
        sparklineData: generateSparklineData(4.56, 0.16),
        marketType: 'futures',
        rank: 16,
    },
    {
        id: '17',
        symbol: 'ALGO',
        name: 'Algorand',
        image: getCryptoImage('ALGO'),
        price: 0.1234,
        priceChange24h: -0.0067,
        priceChangePercentage24h: -5.15,
        priceChangePercentage30d: 3.21,
        marketCap: 980000000,
        volume24h: 45000000,
        circulatingSupply: 7940000000,
        sparklineData: generateSparklineData(0.1234, 0.18),
        marketType: 'all',
        rank: 17,
    },
    {
        id: '18',
        symbol: 'VET',
        name: 'VeChain',
        image: getCryptoImage('VET'),
        price: 0.0234,
        priceChange24h: 0.0012,
        priceChangePercentage24h: 5.41,
        priceChangePercentage30d: 11.23,
        marketCap: 1700000000,
        volume24h: 67000000,
        circulatingSupply: 72600000000,
        sparklineData: generateSparklineData(0.0234, 0.19),
        marketType: 'spot',
        rank: 18,
    },
    {
        id: '19',
        symbol: 'FTM',
        name: 'Fantom',
        image: getCryptoImage('FTM'),
        price: 0.3789,
        priceChange24h: 0.0234,
        priceChangePercentage24h: 6.59,
        priceChangePercentage30d: 16.78,
        marketCap: 1060000000,
        volume24h: 78000000,
        circulatingSupply: 2800000000,
        sparklineData: generateSparklineData(0.3789, 0.17),
        marketType: 'futures',
        rank: 19,
    },
    {
        id: '20',
        symbol: 'SAND',
        name: 'The Sandbox',
        image: getCryptoImage('SAND'),
        price: 0.4567,
        priceChange24h: -0.0234,
        priceChangePercentage24h: -4.87,
        priceChangePercentage30d: 8.92,
        marketCap: 1020000000,
        volume24h: 89000000,
        circulatingSupply: 2230000000,
        sparklineData: generateSparklineData(0.4567, 0.21),
        marketType: 'all',
        rank: 20,
    },
    {
        id: '21',
        symbol: 'MANA',
        name: 'Decentraland',
        image: getCryptoImage('MANA'),
        price: 0.6234,
        priceChange24h: 0.0345,
        priceChangePercentage24h: 5.86,
        priceChangePercentage30d: 12.45,
        marketCap: 1150000000,
        volume24h: 95000000,
        circulatingSupply: 1845000000,
        sparklineData: generateSparklineData(0.6234, 0.19),
        marketType: 'spot',
        rank: 21,
    },
    {
        id: '22',
        symbol: 'APE',
        name: 'ApeCoin',
        image: getCryptoImage('APE'),
        price: 1.45,
        priceChange24h: -0.08,
        priceChangePercentage24h: -6.11,
        priceChangePercentage30d: -2.34,
        marketCap: 1230000000,
        volume24h: 156000000,
        circulatingSupply: 1000000000,
        sparklineData: generateSparklineData(1.23, 0.22),
        marketType: 'futures',
        rank: 22,
    },
    {
        id: '23',
        symbol: 'AAVE',
        name: 'Aave',
        image: getCryptoImage('AAVE'),
        price: 345.67,
        priceChange24h: 4.23,
        priceChangePercentage24h: 5.08,
        priceChangePercentage30d: 18.76,
        marketCap: 1310000000,
        volume24h: 78000000,
        circulatingSupply: 14980000,
        sparklineData: generateSparklineData(87.45, 0.12),
        marketType: 'all',
        rank: 23,
    },
    {
        id: '24',
        symbol: 'COMP',
        name: 'Compound',
        image: getCryptoImage('COMP'),
        price: 45.67,
        priceChange24h: -2.34,
        priceChangePercentage24h: -4.87,
        priceChangePercentage30d: 7.23,
        marketCap: 456700000,
        volume24h: 34000000,
        circulatingSupply: 10000000,
        sparklineData: generateSparklineData(45.67, 0.15),
        marketType: 'spot',
        rank: 24,
    },
    {
        id: '25',
        symbol: 'MKR',
        name: 'Maker',
        image: getCryptoImage('MKR'),
        price: 1567.89,
        priceChange24h: 67.89,
        priceChangePercentage24h: 5.82,
        priceChangePercentage30d: 14.23,
        marketCap: 1234560000,
        volume24h: 45000000,
        circulatingSupply: 1000000,
        sparklineData: generateSparklineData(1234.56, 0.08),
        marketType: 'futures',
        rank: 25,
    },
    {
        id: '26',
        symbol: 'SUSHI',
        name: 'SushiSwap',
        image: getCryptoImage('SUSHI'),
        price: 1.45,
        priceChange24h: 0.12,
        priceChangePercentage24h: 9.03,
        priceChangePercentage30d: 22.45,
        marketCap: 185000000,
        volume24h: 23000000,
        circulatingSupply: 127500000,
        sparklineData: generateSparklineData(1.45, 0.18),
        marketType: 'all',
        rank: 26,
    },
    {
        id: '27',
        symbol: 'CRV',
        name: 'Curve DAO Token',
        image: getCryptoImage('CRV'),
        price: 0.89,
        priceChange24h: -0.05,
        priceChangePercentage24h: -5.32,
        priceChangePercentage30d: 3.45,
        marketCap: 890000000,
        volume24h: 67000000,
        circulatingSupply: 1000000000,
        sparklineData: generateSparklineData(0.89, 0.16),
        marketType: 'spot',
        rank: 27,
    },
    {
        id: '28',
        symbol: 'YFI',
        name: 'yearn.finance',
        image: getCryptoImage('YFI'),
        price: 6789.12,
        priceChange24h: 234.56,
        priceChangePercentage24h: 3.58,
        priceChangePercentage30d: 11.23,
        marketCap: 247000000,
        volume24h: 12000000,
        circulatingSupply: 36400,
        sparklineData: generateSparklineData(6789.12, 0.07),
        marketType: 'futures',
        rank: 28,
    },
    {
        id: '29',
        symbol: 'SNX',
        name: 'Synthetix',
        image: getCryptoImage('SNX'),
        price: 2.34,
        priceChange24h: 0.18,
        priceChangePercentage24h: 8.33,
        priceChangePercentage30d: 19.87,
        marketCap: 780000000,
        volume24h: 45000000,
        circulatingSupply: 333333333,
        sparklineData: generateSparklineData(2.34, 0.17),
        marketType: 'all',
        rank: 29,
    },
    {
        id: '30',
        symbol: 'BAL',
        name: 'Balancer',
        image: getCryptoImage('BAL'),
        price: 5.67,
        priceChange24h: -0.34,
        priceChangePercentage24h: -5.66,
        priceChangePercentage30d: 2.34,
        marketCap: 567000000,
        volume24h: 28000000,
        circulatingSupply: 100000000,
        sparklineData: generateSparklineData(5.67, 0.14),
        marketType: 'spot',
        rank: 30,
    },
    {
        id: '31',
        symbol: 'THETA',
        name: 'Theta Network',
        image: getCryptoImage('THETA'),
        price: 1.12,
        priceChange24h: 0.08,
        priceChangePercentage24h: 7.69,
        priceChangePercentage30d: 15.23,
        marketCap: 1120000000,
        volume24h: 89000000,
        circulatingSupply: 1000000000,
        sparklineData: generateSparklineData(1.12, 0.13),
        marketType: 'futures',
        rank: 31,
    },
    {
        id: '32',
        symbol: 'TFUEL',
        name: 'Theta Fuel',
        image: getCryptoImage('TFUEL'),
        price: 0.067,
        priceChange24h: 0.004,
        priceChangePercentage24h: 6.35,
        priceChangePercentage30d: 12.89,
        marketCap: 445000000,
        volume24h: 34000000,
        circulatingSupply: 6644905769,
        sparklineData: generateSparklineData(0.067, 0.2),
        marketType: 'all',
        rank: 32,
    },
    {
        id: '33',
        symbol: 'FIL',
        name: 'Filecoin',
        image: getCryptoImage('FIL'),
        price: 4.23,
        priceChange24h: -0.23,
        priceChangePercentage24h: -5.16,
        priceChangePercentage30d: 1.45,
        marketCap: 1900000000,
        volume24h: 156000000,
        circulatingSupply: 449000000,
        sparklineData: generateSparklineData(4.23, 0.15),
        marketType: 'spot',
        rank: 33,
    },
    {
        id: '34',
        symbol: 'AR',
        name: 'Arweave',
        image: getCryptoImage('AR'),
        price: 8.45,
        priceChange24h: 0.67,
        priceChangePercentage24h: 8.61,
        priceChangePercentage30d: 23.45,
        marketCap: 553000000,
        volume24h: 45000000,
        circulatingSupply: 65454185,
        sparklineData: generateSparklineData(8.45, 0.16),
        marketType: 'futures',
        rank: 34,
    },
    {
        id: '35',
        symbol: 'STORJ',
        name: 'Storj',
        image: getCryptoImage('STORJ'),
        price: 0.45,
        priceChange24h: 0.03,
        priceChangePercentage24h: 7.14,
        priceChangePercentage30d: 18.92,
        marketCap: 180000000,
        volume24h: 12000000,
        circulatingSupply: 400000000,
        sparklineData: generateSparklineData(0.45, 0.19),
        marketType: 'all',
        rank: 35,
    },
    {
        id: '36',
        symbol: 'OCEAN',
        name: 'Ocean Protocol',
        image: getCryptoImage('OCEAN'),
        price: 0.34,
        priceChange24h: -0.02,
        priceChangePercentage24h: -5.56,
        priceChangePercentage30d: 4.23,
        marketCap: 238000000,
        volume24h: 23000000,
        circulatingSupply: 700000000,
        sparklineData: generateSparklineData(0.34, 0.17),
        marketType: 'spot',
        rank: 36,
    },
    {
        id: '37',
        symbol: 'GRT',
        name: 'The Graph',
        image: getCryptoImage('GRT'),
        price: 0.12,
        priceChange24h: 0.008,
        priceChangePercentage24h: 7.14,
        priceChangePercentage30d: 16.78,
        marketCap: 1140000000,
        volume24h: 78000000,
        circulatingSupply: 9500000000,
        sparklineData: generateSparklineData(0.12, 0.21),
        marketType: 'futures',
        rank: 37,
    },
    {
        id: '38',
        symbol: 'BAT',
        name: 'Basic Attention Token',
        image: getCryptoImage('BAT'),
        price: 0.23,
        priceChange24h: -0.01,
        priceChangePercentage24h: -4.17,
        priceChangePercentage30d: 8.33,
        marketCap: 344000000,
        volume24h: 34000000,
        circulatingSupply: 1500000000,
        sparklineData: generateSparklineData(0.23, 0.18),
        marketType: 'all',
        rank: 38,
    },
    {
        id: '39',
        symbol: 'ENJ',
        name: 'Enjin Coin',
        image: getCryptoImage('ENJ'),
        price: 0.34,
        priceChange24h: 0.02,
        priceChangePercentage24h: 6.25,
        priceChangePercentage30d: 14.71,
        marketCap: 285000000,
        volume24h: 28000000,
        circulatingSupply: 838000000,
        sparklineData: generateSparklineData(0.34, 0.16),
        marketType: 'spot',
        rank: 39,
    },
    {
        id: '40',
        symbol: 'CHZ',
        name: 'Chiliz',
        image: getCryptoImage('CHZ'),
        price: 0.089,
        priceChange24h: 0.006,
        priceChangePercentage24h: 7.23,
        priceChangePercentage30d: 19.28,
        marketCap: 712000000,
        volume24h: 67000000,
        circulatingSupply: 8000000000,
        sparklineData: generateSparklineData(0.089, 0.2),
        marketType: 'futures',
        rank: 40,
    },
    {
        id: '41',
        symbol: 'MANA',
        name: 'Decentraland',
        image: getCryptoImage('MANA'),
        price: 0.45,
        priceChange24h: -0.03,
        priceChangePercentage24h: -6.25,
        priceChangePercentage30d: 3.45,
        marketCap: 830000000,
        volume24h: 89000000,
        circulatingSupply: 1844000000,
        sparklineData: generateSparklineData(0.45, 0.17),
        marketType: 'all',
        rank: 41,
    },
    {
        id: '42',
        symbol: 'FLOW',
        name: 'Flow',
        image: getCryptoImage('FLOW'),
        price: 0.78,
        priceChange24h: 0.05,
        priceChangePercentage24h: 6.85,
        priceChangePercentage30d: 17.95,
        marketCap: 812000000,
        volume24h: 45000000,
        circulatingSupply: 1041000000,
        sparklineData: generateSparklineData(0.78, 0.15),
        marketType: 'spot',
        rank: 42,
    },
    {
        id: '43',
        symbol: 'ICP',
        name: 'Internet Computer',
        image: getCryptoImage('ICP'),
        price: 4.56,
        priceChange24h: -0.34,
        priceChangePercentage24h: -6.94,
        priceChangePercentage30d: -1.23,
        marketCap: 2100000000,
        volume24h: 123000000,
        circulatingSupply: 460000000,
        sparklineData: generateSparklineData(4.56, 0.18),
        marketType: 'futures',
        rank: 43,
    },
    {
        id: '44',
        symbol: 'HBAR',
        name: 'Hedera',
        image: getCryptoImage('HBAR'),
        price: 0.056,
        priceChange24h: 0.003,
        priceChangePercentage24h: 5.66,
        priceChangePercentage30d: 12.34,
        marketCap: 1890000000,
        volume24h: 78000000,
        circulatingSupply: 33750000000,
        sparklineData: generateSparklineData(0.056, 0.19),
        marketType: 'all',
        rank: 44,
    },
    {
        id: '45',
        symbol: 'XTZ',
        name: 'Tezos',
        image: getCryptoImage('XTZ'),
        price: 0.89,
        priceChange24h: -0.06,
        priceChangePercentage24h: -6.32,
        priceChangePercentage30d: 2.45,
        marketCap: 820000000,
        volume24h: 56000000,
        circulatingSupply: 921000000,
        sparklineData: generateSparklineData(0.89, 0.14),
        marketType: 'spot',
        rank: 45,
    },
    {
        id: '46',
        symbol: 'EOS',
        name: 'EOS',
        image: getCryptoImage('EOS'),
        price: 0.67,
        priceChange24h: 0.04,
        priceChangePercentage24h: 6.35,
        priceChangePercentage30d: 15.67,
        marketCap: 670000000,
        volume24h: 45000000,
        circulatingSupply: 1000000000,
        sparklineData: generateSparklineData(0.67, 0.16),
        marketType: 'futures',
        rank: 46,
    },
    {
        id: '47',
        symbol: 'DASH',
        name: 'Dash',
        image: getCryptoImage('DASH'),
        price: 28.45,
        priceChange24h: 1.23,
        priceChangePercentage24h: 4.52,
        priceChangePercentage30d: 11.89,
        marketCap: 324000000,
        volume24h: 23000000,
        circulatingSupply: 11400000,
        sparklineData: generateSparklineData(28.45, 0.12),
        marketType: 'all',
        rank: 47,
    },
    {
        id: '48',
        symbol: 'ZEC',
        name: 'Zcash',
        image: getCryptoImage('ZEC'),
        price: 34.56,
        priceChange24h: -1.89,
        priceChangePercentage24h: -5.18,
        priceChangePercentage30d: 3.45,
        marketCap: 520000000,
        volume24h: 34000000,
        circulatingSupply: 15050000,
        sparklineData: generateSparklineData(34.56, 0.13),
        marketType: 'spot',
        rank: 48,
    },
    {
        id: '49',
        symbol: 'XMR',
        name: 'Monero',
        image: getCryptoImage('XMR'),
        price: 156.78,
        priceChange24h: 8.9,
        priceChangePercentage24h: 6.02,
        priceChangePercentage30d: 18.45,
        marketCap: 2850000000,
        volume24h: 89000000,
        circulatingSupply: 18180000,
        sparklineData: generateSparklineData(156.78, 0.09),
        marketType: 'futures',
        rank: 49,
    },
    {
        id: '50',
        symbol: 'DCR',
        name: 'Decred',
        image: getCryptoImage('DCR'),
        price: 23.45,
        priceChange24h: 1.56,
        priceChangePercentage24h: 7.13,
        priceChangePercentage30d: 16.78,
        marketCap: 340000000,
        volume24h: 12000000,
        circulatingSupply: 14500000,
        sparklineData: generateSparklineData(23.45, 0.15),
        marketType: 'all',
        rank: 50,
    },
]

export const marketStatistics = {
    hot: cryptoMarketData.slice(0, 3),
    newListings: [
        cryptoMarketData[15],
        cryptoMarketData[16],
        cryptoMarketData[17],
    ],
    topGainers: cryptoMarketData
        .filter((crypto) => crypto.priceChangePercentage24h > 0)
        .sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h)
        .slice(0, 3),
    topLosers: cryptoMarketData
        .filter((crypto) => crypto.priceChangePercentage24h < 0)
        .sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h)
        .slice(0, 3),
}

export const marketOverview = {
    totalMarketCap: 3750000000000,
    totalVolume24h: 185000000000,
    marketCapChange24h: 1.87,
    btcDominance: 54.2,
    ethDominance: 16.8,
}

export const coinDetailsData = (id: string) => {
    const coin = cryptoMarketData.find((c) => c.symbol.toLowerCase() === id)
    if (!coin) return null

    const totalMarketCap = marketOverview.totalMarketCap
    const marketDominance = (coin.marketCap / totalMarketCap) * 100

    if (coin.symbol.toLowerCase() === 'btc') {
        return {
            ...coin,
            totalSupply: 19750000,
            maxSupply: 21000000,
            marketDominance: 54.2,
            tvl: undefined,
            weekHigh52: 108000,
            weekLow52: 38500,
            volatilityIndex: 0.65,
            sharpeRatio: 1.2,
            activeAddresses: 950000,
            dailyTransactions: 320000,
            averageGasFees: 15.5,
            description: generateCoinDescription(coin.name, coin.symbol),
            website: 'https://bitcoin.org',
            whitepaper: 'https://bitcoin.org/bitcoin.pdf',
            github: 'https://github.com/bitcoin/bitcoin',
            twitter: 'https://twitter.com/bitcoin',
            telegram: undefined,
        }
    }

    return {
        ...coin,
        totalSupply: coin.circulatingSupply * (1.1 + Math.random() * 0.3),
        maxSupply:
            Math.random() > 0.3
                ? coin.circulatingSupply * (1.5 + Math.random() * 2)
                : undefined,
        marketDominance,
        tvl:
            coin.marketCap > 10000000000
                ? Math.random() * 5000000000 + 1000000000
                : undefined,
        weekHigh52: coin.price * (1.2 + Math.random() * 1.8),
        weekLow52: coin.price * (0.3 + Math.random() * 0.4),
        volatilityIndex: 0.3 + Math.random() * 0.7,
        sharpeRatio: Math.random() * 3 - 0.5,
        activeAddresses: Math.floor(Math.random() * 1000000 + 50000),
        dailyTransactions: Math.floor(Math.random() * 2000000 + 100000),
        averageGasFees: Math.random() * 50 + 1,
        description: generateCoinDescription(coin.name, coin.symbol),
        website: `https://${coin.symbol.toLowerCase()}.org`,
        whitepaper: `https://${coin.symbol.toLowerCase()}.org/whitepaper.pdf`,
        github: `https://github.com/${coin.symbol.toLowerCase()}`,
        twitter: `https://twitter.com/${coin.symbol.toLowerCase()}`,
        telegram: `https://t.me/${coin.symbol.toLowerCase()}`,
    }
}

export const chartDataSets = (id: string) => {
    const coin = cryptoMarketData.find((c) => c.symbol.toLowerCase() === id)
    if (!coin) return null
    return {
        '1h': generateChartData(coin.price, '1h'),
        '24h': generateChartData(coin.price, '24h'),
        '7d': generateChartData(coin.price, '7d'),
        '30d': generateChartData(coin.price, '30d'),
        '1y': generateChartData(coin.price, '1y'),
        YTD: generateChartData(coin.price, 'YTD'),
        ALL: generateChartData(coin.price, 'ALL'),
    }
}

export const newsArticlesData = (id: string) => {
    const coin = cryptoMarketData.find((c) => c.symbol.toLowerCase() === id)
    if (!coin) return null

    return generateNewsArticles(coin.name, coin.symbol)
}

export const spotTradingPairs: SpotMarketData[] = [
    {
        pair: 'BTC-USDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        price: 97234.56,
        change24h: 1234.56,
        changePercentage24h: 2.81,
        volume24h: 28500000000,
    },
    {
        pair: 'ETH-USDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        price: 3456.78,
        change24h: -89.23,
        changePercentage24h: -3.04,
        volume24h: 15200000000,
    },
    {
        pair: 'BNB-USDT',
        baseAsset: 'BNB',
        quoteAsset: 'USDT',
        price: 695.42,
        change24h: 15.67,
        changePercentage24h: 5.27,
        volume24h: 1800000000,
    },
    {
        pair: 'SOL-USDT',
        baseAsset: 'SOL',
        quoteAsset: 'USDT',
        price: 189.45,
        change24h: 7.23,
        changePercentage24h: 7.92,
        volume24h: 2100000000,
    },
    {
        pair: 'XRP-USDT',
        baseAsset: 'XRP',
        quoteAsset: 'USDT',
        price: 2.18,
        change24h: -0.0234,
        changePercentage24h: -4.28,
        volume24h: 1200000000,
    },
    {
        pair: 'DOGE-USDT',
        baseAsset: 'DOGE',
        quoteAsset: 'USDT',
        price: 0.3245,
        change24h: 0.0045,
        changePercentage24h: 6.05,
        volume24h: 890000000,
    },
    {
        pair: 'ADA-USDT',
        baseAsset: 'ADA',
        quoteAsset: 'USDT',
        price: 0.89,
        change24h: -0.034,
        changePercentage24h: -3.68,
        volume24h: 1100000000,
    },
    {
        pair: 'AVAX-USDT',
        baseAsset: 'AVAX',
        quoteAsset: 'USDT',
        price: 42.56,
        change24h: 2.34,
        changePercentage24h: 5.82,
        volume24h: 780000000,
    },
    {
        pair: 'LINK-USDT',
        baseAsset: 'LINK',
        quoteAsset: 'USDT',
        price: 23.45,
        change24h: -1.23,
        changePercentage24h: -4.98,
        volume24h: 650000000,
    },
    {
        pair: 'DOT-USDT',
        baseAsset: 'DOT',
        quoteAsset: 'USDT',
        price: 7.89,
        change24h: 0.45,
        changePercentage24h: 6.05,
        volume24h: 520000000,
    },
    {
        pair: 'MATIC-USDT',
        baseAsset: 'MATIC',
        quoteAsset: 'USDT',
        price: 0.456,
        change24h: -0.023,
        changePercentage24h: -4.81,
        volume24h: 480000000,
    },
    {
        pair: 'UNI-USDT',
        baseAsset: 'UNI',
        quoteAsset: 'USDT',
        price: 12.34,
        change24h: 0.89,
        changePercentage24h: 7.77,
        volume24h: 420000000,
    },
    {
        pair: 'LTC-USDT',
        baseAsset: 'LTC',
        quoteAsset: 'USDT',
        price: 89.45,
        change24h: -3.21,
        changePercentage24h: -3.46,
        volume24h: 380000000,
    },
    {
        pair: 'ATOM-USDT',
        baseAsset: 'ATOM',
        quoteAsset: 'USDT',
        price: 8.67,
        change24h: 0.34,
        changePercentage24h: 4.08,
        volume24h: 340000000,
    },
    {
        pair: 'FTM-USDT',
        baseAsset: 'FTM',
        quoteAsset: 'USDT',
        price: 0.789,
        change24h: 0.056,
        changePercentage24h: 7.64,
        volume24h: 290000000,
    },
    {
        pair: 'BTC3L-USDT',
        baseAsset: 'BTC3L',
        quoteAsset: 'USDT',
        price: 45.67,
        change24h: 8.45,
        changePercentage24h: 22.7,
        volume24h: 150000000,
        leverage: '3X',
    },
    {
        pair: 'ETH5L-USDT',
        baseAsset: 'ETH5L',
        quoteAsset: 'USDT',
        price: 23.89,
        change24h: -4.56,
        changePercentage24h: -16.05,
        volume24h: 120000000,
        leverage: '5X',
    },
    {
        pair: 'BNB10L-USDT',
        baseAsset: 'BNB10L',
        quoteAsset: 'USDT',
        price: 12.34,
        change24h: 6.78,
        changePercentage24h: 121.8,
        volume24h: 80000000,
        leverage: '10X',
    },
]

export const getSpotTradingData = (pair: string) => {
    const pairData =
        spotTradingPairs.find((p) => p.pair === pair) || spotTradingPairs[0]

    return {
        pair: pairData.pair,
        price: pairData.price,
        priceChange24h: pairData.change24h,
        priceChangePercentage24h: pairData.changePercentage24h,
        indexPrice: pairData.price * (1 + (Math.random() - 0.5) * 0.001),
        high24h: pairData.price * (1 + Math.random() * 0.05 + 0.01),
        low24h: pairData.price * (1 - Math.random() * 0.05 - 0.01),
        volume24h: pairData.volume24h,
        baseAsset: pairData.baseAsset,
        quoteAsset: pairData.quoteAsset,
        image: getCryptoImage(pairData.baseAsset),
        lastUpdate: Date.now(),
    }
}

export const getOrderBookData = (pair: string): OrderBookData => {
    const pairData =
        spotTradingPairs.find((p) => p.pair === pair) || spotTradingPairs[0]
    return generateOrderBook(pairData.price)
}

export const getTradeExecutions = (pair: string): TradeExecution[] => {
    const pairData =
        spotTradingPairs.find((p) => p.pair === pair) || spotTradingPairs[0]
    return generateTradeExecutions(pairData.price)
}

export const getSpotChartData = (pair: string, timeRange: ChartTimeRange) => {
    const pairData =
        spotTradingPairs.find((p) => p.pair === pair) || spotTradingPairs[0]
    return generateSpotChartData(pairData.price, timeRange)
}

export const generateBalances = () => [
    {
        asset: 'USDT',
        available: 10000.5,
        locked: 2500.25,
    },
    {
        asset: 'BTC',
        available: 0.15234,
        locked: 0.05,
    },
    {
        asset: 'ETH',
        available: 2.45678,
        locked: 0.5,
    },
    {
        asset: 'BNB',
        available: 15.75,
        locked: 5.25,
    },
    {
        asset: 'SOL',
        available: 25.5,
        locked: 0,
    },
]

export const generateOrderHistory = () => [
    {
        id: 'hist-001',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        pair: 'BTC-USDT',
        type: 'limit',
        side: 'buy',
        averagePrice: 97100.0,
        price: 97000.0,
        executed: 0.005,
        amount: 0.005,
        total: 485.5,
        status: 'filled',
    },
    {
        id: 'hist-002',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
        pair: 'ETH-USDT',
        type: 'market',
        side: 'sell',
        averagePrice: 3480.5,
        price: 3480.5,
        executed: 1.0,
        amount: 1.0,
        total: 3480.5,
        status: 'filled',
    },
    {
        id: 'hist-003',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
        pair: 'BNB-USDT',
        type: 'limit',
        side: 'buy',
        averagePrice: 690.25,
        price: 690.0,
        executed: 5.0,
        amount: 5.0,
        total: 3451.25,
        status: 'filled',
    },
    {
        id: 'hist-004',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
        pair: 'SOL-USDT',
        type: 'stop-limit',
        side: 'sell',
        averagePrice: 0,
        price: 190.0,
        executed: 0,
        amount: 20,
        total: 3800.0,
        triggerConditions: 'Stop Price ≤ 185.00',
        status: 'cancelled',
    },
    {
        id: 'hist-005',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 12),
        pair: 'ADA-USDT',
        type: 'limit',
        side: 'buy',
        averagePrice: 0.88,
        price: 0.89,
        executed: 500,
        amount: 1000,
        total: 890.0,
        status: 'partial',
    },
    {
        id: 'hist-006',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        pair: 'LINK-USDT',
        type: 'market',
        side: 'buy',
        averagePrice: 23.15,
        price: 23.15,
        executed: 50,
        amount: 50,
        total: 1157.5,
        status: 'filled',
    },
]

export const generateTradeHistory = () => [
    {
        id: 'trade-001',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        pair: 'BTC-USDT',
        side: 'buy',
        price: 97100.0,
        amount: 0.005,
        total: 485.5,
        fee: 0.000005,
        feeAsset: 'BTC',
    },
    {
        id: 'trade-002',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
        pair: 'ETH-USDT',
        side: 'sell',
        price: 3480.5,
        amount: 1.0,
        total: 3480.5,
        fee: 3.48,
        feeAsset: 'USDT',
    },
    {
        id: 'trade-003',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
        pair: 'BNB-USDT',
        side: 'buy',
        price: 690.25,
        amount: 5.0,
        total: 3451.25,
        fee: 0.005,
        feeAsset: 'BNB',
    },
    {
        id: 'trade-004',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 10),
        pair: 'SOL-USDT',
        side: 'sell',
        price: 188.75,
        amount: 15,
        total: 2831.25,
        fee: 2.83,
        feeAsset: 'USDT',
    },
    {
        id: 'trade-005',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 14),
        pair: 'DOGE-USDT',
        side: 'buy',
        price: 0.315,
        amount: 2000,
        total: 630.0,
        fee: 0.63,
        feeAsset: 'USDT',
    },
    {
        id: 'trade-006',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 18),
        pair: 'ADA-USDT',
        side: 'sell',
        price: 0.92,
        amount: 800,
        total: 736.0,
        fee: 0.736,
        feeAsset: 'USDT',
    },
    {
        id: 'trade-007',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        pair: 'LINK-USDT',
        side: 'buy',
        price: 23.15,
        amount: 50,
        total: 1157.5,
        fee: 0.05,
        feeAsset: 'LINK',
    },
    {
        id: 'trade-008',
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 30),
        pair: 'MATIC-USDT',
        side: 'buy',
        price: 0.445,
        amount: 5000,
        total: 2225.0,
        fee: 2.225,
        feeAsset: 'USDT',
    },
]

export const getBalanceByAsset = (balances: any[], asset: string) => {
    return balances.find((balance) => balance.asset === asset)
}

export const getOpenOrdersByPair = () => {
    return [
        {
            id: 'order-fixed-001',
            date: new Date('2025-01-05T10:30:00Z'),
            pair: 'BTC-USDT',
            type: 'limit' as const,
            side: 'buy' as const,
            price: 96500.0,
            amount: 0.01,
            filled: 0,
            total: 965.0,
            sor: false,
            takeProfit: 98000.0,
            stopLoss: undefined,
            status: 'pending' as const,
        },
        {
            id: 'order-fixed-002',
            date: new Date('2025-01-05T11:15:00Z'),
            pair: 'ETH-USDT',
            type: 'limit' as const,
            side: 'sell' as const,
            price: 3600.0,
            amount: 0.5,
            filled: 0.2,
            total: 1800.0,
            sor: true,
            takeProfit: undefined,
            stopLoss: 3400.0,
            status: 'partial' as const,
        },
        {
            id: 'order-fixed-003',
            date: new Date('2025-01-05T12:00:00Z'),
            pair: 'BNB-USDT',
            type: 'stop-limit' as const,
            side: 'buy' as const,
            price: 700.0,
            amount: 2.0,
            filled: 0,
            total: 1400.0,
            sor: false,
            takeProfit: undefined,
            stopLoss: undefined,
            status: 'pending' as const,
        },
    ]
}

export const getOrderHistoryByPair = (orders: any[], pair: string) => {
    return orders.filter((order) => order.pair === pair)
}

export const getTradeHistoryByPair = (trades: any[], pair: string) => {
    return trades.filter((trade) => trade.pair === pair)
}

export const generatePortfolioOverview = (dateRange: string) => {
    let seed = 0
    switch (dateRange) {
        case '1d':
            seed = 1
            break
        case '7d':
            seed = 7
            break
        case '1m':
            seed = 30
            break
        case '3m':
            seed = 90
            break
        case '1y':
            seed = 365
            break
        case 'ALL':
            seed = 1000
            break
        default:
            seed = 1
    }

    const baseTotalValue = 125340.45
    const baseTrading = 24580.32

    const totalVariation = Math.sin(seed * 0.1) * 8000
    const tradingVariation = Math.sin(seed * 0.15) * 3000

    const totalValue = baseTotalValue + totalVariation
    const tradingBalance = baseTrading + tradingVariation

    const maxChange = Math.min(seed * 0.05, 15)
    const changePercentage = Math.sin(seed * 0.08) * maxChange
    const change24h = totalValue * (changePercentage / 100)

    return {
        totalValue: Math.round(totalValue * 100) / 100,
        tradingBalance: Math.round(tradingBalance * 100) / 100,
        totalChange24h: Math.round(change24h * 100) / 100,
        totalChangePercentage24h: Math.round(changePercentage * 100) / 100,
    }
}

export const generatePortfolioAssets = () => {
    const assets = [
        { name: 'Bitcoin', symbol: 'BTC', balance: 2.45678 },
        { name: 'Ethereum', symbol: 'ETH', balance: 15.8934 },
        { name: 'Polygon', symbol: 'MATIC', balance: 1250.45 },
        { name: 'Uniswap', symbol: 'UNI', balance: 89.234 },
        { name: 'Chainlink', symbol: 'LINK', balance: 156.78 },
        { name: 'Solana', symbol: 'SOL', balance: 45.67 },
    ]

    return assets.map((asset, index) => {
        const price = Math.random() * 1000 + 10
        const value = asset.balance * price
        const changePercentage = (Math.random() - 0.5) * 30
        const change24h = value * (changePercentage / 100)

        return {
            id: `asset-${index + 1}`,
            name: asset.name,
            symbol: asset.symbol,
            icon: getCryptoImage(asset.symbol),
            balance: asset.balance,
            value,
            priceChange24h: change24h,
            priceChangePercentage24h: changePercentage,
            allocation: Math.random() * 30 + 5,
        }
    })
}

export const generatePortfolioChart = (dateRange: string) => {
    const now = Date.now()
    let points: number
    let interval: number

    switch (dateRange) {
        case '1d':
            points = 24
            interval = 60 * 60 * 1000
            break
        case '7d':
            points = 7
            interval = 24 * 60 * 60 * 1000
            break
        case '1m':
            points = 30
            interval = 24 * 60 * 60 * 1000
            break
        case '3m':
            points = 90
            interval = 24 * 60 * 60 * 1000
            break
        case '1y':
            points = 52
            interval = 7 * 24 * 60 * 60 * 1000
            break
        case 'ALL':
            points = 100
            interval = 7 * 24 * 60 * 60 * 1000
            break
        default:
            points = 24
            interval = 60 * 60 * 1000
    }

    const baseValue = 125000
    const data: any[] = []
    let currentValue = baseValue

    for (let i = points; i >= 0; i--) {
        const timestamp = now - i * interval
        const progress = (points - i) / points

        const overallTrend = baseValue + baseValue * 0.08 * progress

        const majorSwing = Math.sin(progress * Math.PI * 1) * 4000
        const minorSwing = Math.sin(progress * Math.PI * 15) * 1500
        const randomWalk = (Math.random() - 0.5) * 2000

        currentValue = overallTrend + majorSwing + minorSwing + randomWalk

        currentValue = Math.max(currentValue, baseValue * 0.85)
        currentValue = Math.min(currentValue, baseValue * 1.25)

        data.push({
            timestamp: Math.floor(timestamp / 1000),
            value: Math.round(currentValue * 100) / 100,
        })
    }

    return data
}

export const generateTransactionHistory = (index: number) => {
    const transactions = []
    const assets = [
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'ETH', name: 'Ethereum' },
        { symbol: 'MATIC', name: 'Polygon' },
        { symbol: 'UNI', name: 'Uniswap' },
        { symbol: 'LINK', name: 'Chainlink' },
        { symbol: 'SOL', name: 'Solana' },
    ]
    const types = ['deposit', 'withdraw']
    const statuses = ['completed', 'pending', 'failed']

    let seedCounter = index * 1000

    for (let i = 0; i < 50; i++) {
        const assetSeed = seededRandom(seedCounter++)
        const typeSeed = seededRandom(seedCounter++)
        const statusSeed = seededRandom(seedCounter++)
        const amountSeed = seededRandom(seedCounter++)
        const valueSeed = seededRandom(seedCounter++)
        const dateSeed = seededRandom(seedCounter++)
        const hashSeed = seededRandom(seedCounter++)

        const asset = assets[Math.floor(assetSeed * assets.length)]
        const type = types[Math.floor(typeSeed * types.length)]
        const status = statuses[Math.floor(statusSeed * statuses.length)]
        const amount = amountSeed * 10 + 0.1
        const value = amount * (valueSeed * 1000 + 10)
        const fee = value * 0.001

        transactions.push({
            id: `tx-${i + 1}`,
            date: Date.now() - dateSeed * 30 * 24 * 60 * 60 * 1000,
            type,
            asset: asset.symbol,
            name: asset.name,
            icon: getCryptoImage(asset.symbol),
            amount,
            value,
            fee,
            status,
            txHash:
                status === 'completed'
                    ? `0x${Math.floor(hashSeed * 1000000000000)
                          .toString(16)
                          .padStart(40, '0')}`
                    : undefined,
        })
    }

    return transactions.sort((a, b) => b.date - a.date)
}

export const generateTradeHistoryData = (index: number = 1) => {
    const trades: any[] = []
    const assets = [
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'ETH', name: 'Ethereum' },
        { symbol: 'MATIC', name: 'Polygon' },
        { symbol: 'UNI', name: 'Uniswap' },
        { symbol: 'LINK', name: 'Chainlink' },
        { symbol: 'SOL', name: 'Solana' },
    ]
    const types = ['buy', 'sell', 'swap']
    const statuses = ['completed', 'pending', 'failed']

    let seedCounter = index * 2000

    for (let i = 0; i < 40; i++) {
        const assetSeed = seededRandom(seedCounter++)
        const typeSeed = seededRandom(seedCounter++)
        const statusSeed = seededRandom(seedCounter++)
        const amountSeed = seededRandom(seedCounter++)
        const valueSeed = seededRandom(seedCounter++)
        const dateSeed = seededRandom(seedCounter++)
        const pnlSeed = seededRandom(seedCounter++)

        const asset = assets[Math.floor(assetSeed * assets.length)]
        const type = types[Math.floor(typeSeed * types.length)]
        const status = statuses[Math.floor(statusSeed * statuses.length)]
        const amount = amountSeed * 5 + 0.01
        const value = amount * (valueSeed * 1000 + 10)
        const fee = value * 0.0025

        let pnlPercentage: number | undefined
        let pnlAmount: number | undefined

        if ((type === 'sell' || type === 'swap') && status === 'completed') {
            if (type === 'sell') {
                pnlPercentage = (pnlSeed - 0.7) * 30
            } else {
                pnlPercentage = (pnlSeed - 0.5) * 20
            }
            pnlAmount = value * (pnlPercentage / 100)
        }

        trades.push({
            id: `trade-${i + 1}`,
            date: Date.now() - dateSeed * 30 * 24 * 60 * 60 * 1000,
            type,
            asset: asset.symbol,
            name: asset.name,
            icon: getCryptoImage(asset.symbol),
            amount,
            value,
            fee,
            status,
            pnlPercentage,
            pnlAmount,
        })
    }

    return trades.sort((a, b) => b.date - a.date)
}

export const getAvailableNetworks = () => [
    { id: 'erc20', name: 'Ethereum (ERC20)', symbol: 'ETH', fee: 0.005 },
    {
        id: 'bep20',
        name: 'Binance Smart Chain (BEP20)',
        symbol: 'BNB',
        fee: 0.001,
    },
    { id: 'trc20', name: 'Tron (TRC20)', symbol: 'TRX', fee: 1.0 },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', fee: 0.01 },
]

export const generateWalletAddress = (network: string): string => {
    const prefixes = {
        erc20: '0x',
        bep20: '0x',
        trc20: 'T',
        polygon: '0x',
    }

    const prefix = prefixes[network as keyof typeof prefixes] || '0x'
    const length = network === 'trc20' ? 34 : 42
    const chars = '0123456789abcdef'
    let address = prefix

    for (let i = prefix.length; i < length; i++) {
        address += chars[Math.floor(Math.random() * chars.length)]
    }

    return address
}

const generateDashboardCandlestickData = (
    basePrice: number,
    timeRange: string,
    seed: number = 98765,
) => {
    const now = Date.now()
    let points: number
    let interval: number
    let dateFormat: (timestamp: number) => string

    switch (timeRange) {
        case '1w':
            points = 7
            interval = 24 * 60 * 60 * 1000
            dateFormat = (ts) =>
                new Date(ts).toLocaleDateString('en-US', { weekday: 'short' })
            break
        case '1m':
            points = 30
            interval = 24 * 60 * 60 * 1000
            dateFormat = (ts) =>
                new Date(ts).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })
            break
        case '3m':
            points = 90
            interval = 24 * 60 * 60 * 1000
            dateFormat = (ts) =>
                new Date(ts).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })
            break
        case '6m':
            points = 26
            interval = 7 * 24 * 60 * 60 * 1000
            dateFormat = (ts) =>
                new Date(ts).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })
            break
        case '1y':
            points = 52
            interval = 7 * 24 * 60 * 60 * 1000
            dateFormat = (ts) =>
                new Date(ts).toLocaleDateString('en-US', { month: 'short' })
            break
        default:
            points = 90
            interval = 24 * 60 * 60 * 1000
            dateFormat = (ts) =>
                new Date(ts).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })
    }

    const data: any[] = []
    const startPrice = basePrice * 0.75
    const endPrice = basePrice
    const totalGrowth = endPrice - startPrice

    for (let i = points; i >= 0; i--) {
        const timestamp = now - i * interval
        const progress = (points - i) / points

        const trendPrice = startPrice + totalGrowth * progress
        const volatility = 0.03

        const randomVariation =
            (seededRandom(seed + i * 3) - 0.5) * volatility * trendPrice
        const basePrice = trendPrice + randomVariation

        const gapSize = (seededRandom(seed + i * 5) - 0.5) * volatility * 0.2
        const open = basePrice * (1 + gapSize)

        const bodyBias = 0.6
        const bodyDirection = seededRandom(seed + i * 7) < bodyBias ? 1 : -1
        const bodySize =
            Math.abs(seededRandom(seed + i * 11) - 0.5) *
            volatility *
            1.5 *
            bodyDirection
        const close = open + bodySize * basePrice

        const range = Math.abs(close - open)
        const wickSize = range * (0.2 + seededRandom(seed + i * 13) * 0.8)
        const high =
            Math.max(open, close) + seededRandom(seed + i * 17) * wickSize
        const low =
            Math.min(open, close) - seededRandom(seed + i * 19) * wickSize * 0.7

        data.push({
            timestamp,
            date: dateFormat(timestamp),
            open: Math.round(open * 100) / 100,
            high: Math.round(high * 100) / 100,
            low: Math.round(low * 100) / 100,
            close: Math.round(close * 100) / 100,
        })
    }

    return data
}

const getDashboardAssets = () => {
    const assetConfigs = [
        { symbol: 'SOL', apy: 5.1, balance: 45.67 },
        { symbol: 'BNB', apy: 4.25, balance: 12.34 },
        { symbol: 'ETH', apy: 3.85, balance: 8.92 },
        { symbol: 'BTC', apy: 2.5, balance: 0.289 },
        { symbol: 'ADA', apy: 4.8, balance: 1250.0 },
    ]

    return assetConfigs
        .map((config, index) => {
            const coin = cryptoMarketData.find(
                (c) => c.symbol === config.symbol,
            )
            if (!coin) return null
            const usdValue = config.balance * coin.price
            return {
                id: `${config.symbol.toLowerCase()}-${index}`,
                name: coin.name,
                symbol: coin.symbol,
                icon: coin.image,
                apy: config.apy,
                sparklineData: coin.sparklineData,
                trend:
                    coin.priceChangePercentage24h >= 0
                        ? 'up'
                        : ('down' as 'up' | 'down'),
                balance: config.balance,
                usdValue: usdValue,
            }
        })
        .filter(Boolean)
}

const getDashboardWatchlist = () => {
    const watchlistConfigs = [
        { symbol: 'BTC', apy: 4.35, isFavorite: true },
        { symbol: 'ETH', apy: 4.1, isFavorite: true },
        { symbol: 'XRP', apy: 3.85, isFavorite: false },
        { symbol: 'DOGE', apy: 2.5, isFavorite: false },
        { symbol: 'SOL', apy: 3.65, isFavorite: true },
    ]

    return watchlistConfigs
        .map((config) => {
            const coin = cryptoMarketData.find(
                (c) => c.symbol === config.symbol,
            )
            if (!coin) return null
            return {
                id: config.symbol.toLowerCase(),
                name: coin.name,
                symbol: coin.symbol,
                icon: coin.image,
                apy: config.apy,
                price: coin.price,
                sparklineData: coin.sparklineData,
                change24h: coin.priceChangePercentage24h,
                marketCap: coin.marketCap,
                isFavorite: config.isFavorite,
            }
        })
        .filter(Boolean)
}

const generateDashboardTransactions = () => {
    const getCoin = (symbol: string) =>
        cryptoMarketData.find((c) => c.symbol === symbol)

    const eth = getCoin('ETH')
    const btc = getCoin('BTC')
    const xrp = getCoin('XRP')
    const ada = getCoin('ADA')
    const link = getCoin('LINK')
    const dot = getCoin('DOT')
    const doge = getCoin('DOGE')

    const transactions = [
        {
            id: 'tx-1',
            assetName: ada?.name || 'Cardano',
            assetSymbol: 'ADA',
            assetIcon: ada?.image || getCryptoImage('ADA'),
            type: 'buy',
            amount: 125.5,
            date: '2025-01-10 · 10:15:30',
            timestamp: new Date('2025-01-10T10:15:30').getTime(),
            status: 'available',
        },
        {
            id: 'tx-2',
            assetName: eth?.name || 'Ethereum',
            assetSymbol: 'ETH',
            assetIcon: eth?.image || getCryptoImage('ETH'),
            type: 'send',
            amount: 0.52,
            date: '2025-01-12 · 21:40:12',
            timestamp: new Date('2025-01-12T21:40:12').getTime(),
            status: 'pending',
        },
        {
            id: 'tx-3',
            assetName: xrp?.name || 'XRP',
            assetSymbol: 'XRP',
            assetIcon: xrp?.image || getCryptoImage('XRP'),
            type: 'buy',
            amount: 189.44,
            date: '2025-01-08 · 09:55:10',
            timestamp: new Date('2025-01-08T09:55:10').getTime(),
            status: 'available',
        },
        {
            id: 'tx-4',
            assetName: link?.name || 'Chainlink',
            assetSymbol: 'LINK',
            assetIcon: link?.image || getCryptoImage('LINK'),
            type: 'send',
            amount: 45.25,
            date: '2025-01-13 · 18:05:22',
            timestamp: new Date('2025-01-13T18:05:22').getTime(),
            status: 'available',
        },
        {
            id: 'tx-5',
            assetName: doge?.name || 'Dogecoin',
            assetSymbol: 'DOGE',
            assetIcon: doge?.image || getCryptoImage('DOGE'),
            type: 'send',
            amount: 856.5,
            date: '2025-01-15 · 14:20:45',
            timestamp: new Date('2025-01-15T14:20:45').getTime(),
            status: 'available',
        },
        {
            id: 'tx-6',
            assetName: dot?.name || 'Polkadot',
            assetSymbol: 'DOT',
            assetIcon: dot?.image || getCryptoImage('DOT'),
            type: 'send',
            amount: 18.75,
            date: '2025-01-08 · 09:55:10',
            timestamp: new Date('2025-01-08T09:55:10').getTime(),
            status: 'available',
        },
        {
            id: 'tx-7',
            assetName: btc?.name || 'Bitcoin',
            assetSymbol: 'BTC',
            assetIcon: btc?.image || getCryptoImage('BTC'),
            type: 'receive',
            amount: 0.125,
            date: '2025-01-14 · 11:30:00',
            timestamp: new Date('2025-01-14T11:30:00').getTime(),
            status: 'available',
        },
        {
            id: 'tx-8',
            assetName: eth?.name || 'Ethereum',
            assetSymbol: 'ETH',
            assetIcon: eth?.image || getCryptoImage('ETH'),
            type: 'receive',
            amount: 1.5,
            date: '2025-01-11 · 16:45:30',
            timestamp: new Date('2025-01-11T16:45:30').getTime(),
            status: 'pending',
        },
        {
            id: 'tx-9',
            assetName: btc?.name || 'Bitcoin',
            assetSymbol: 'BTC',
            assetIcon: btc?.image || getCryptoImage('BTC'),
            type: 'sell',
            amount: 0.08,
            date: '2025-01-09 · 15:22:18',
            timestamp: new Date('2025-01-09T15:22:18').getTime(),
            status: 'available',
        },
    ]

    return transactions.sort((a, b) => b.timestamp - a.timestamp)
}

const getBalanceForTimeRange = (timeRange: string) => {
    const baseBalance = 145282

    switch (timeRange) {
        case '1w':
            return {
                total: baseBalance * 0.98,
                dailyChange: 892.34,
                dailyChangePercent: 4.2,
            }
        case '1m':
            return {
                total: baseBalance,
                dailyChange: 1563.12,
                dailyChangePercent: 8.1,
            }
        case '3m':
            return {
                total: baseBalance * 1.15,
                dailyChange: 2234.45,
                dailyChangePercent: 12.3,
            }
        case '6m':
            return {
                total: baseBalance * 1.28,
                dailyChange: 3456.78,
                dailyChangePercent: 18.7,
            }
        case '1y':
            return {
                total: baseBalance * 1.45,
                dailyChange: 4567.89,
                dailyChangePercent: 22.1,
            }
        default:
            return {
                total: baseBalance,
                dailyChange: 1563.12,
                dailyChangePercent: 8.1,
            }
    }
}

export const getCryptoDashboardData = (timeRange = '3m') => {
    const balance = getBalanceForTimeRange(timeRange)

    return {
        balance,
        chartData: {
            '1w': generateDashboardCandlestickData(balance.total, '1w'),
            '1m': generateDashboardCandlestickData(balance.total, '1m'),
            '3m': generateDashboardCandlestickData(balance.total, '3m'),
            '6m': generateDashboardCandlestickData(balance.total, '6m'),
            '1y': generateDashboardCandlestickData(balance.total, '1y'),
        },
        assets: getDashboardAssets(),
        watchlist: getDashboardWatchlist(),
        transactions: generateDashboardTransactions(),
        walletBalance: {
            usd: 264.0,
            btc: 0.00256,
        },
    }
}

export const getDashboardChartData = (timeRange: string) => {
    const baseBalance = 145282
    return generateDashboardCandlestickData(baseBalance, timeRange)
}

export { getDashboardWatchlist }

export const getDashboardTransactions = (
    type?: 'receive' | 'send' | 'sell' | 'buy',
) => {
    const transactions = generateDashboardTransactions()
    if (type) {
        return transactions.filter((tx) => tx.type === type)
    }
    return transactions
}

export type FiatCurrency = {
    id: string
    name: string
    symbol: string
    code: string
    icon: string
    exchangeRate: number
}

export const fiatCurrencies: FiatCurrency[] = [
    {
        id: 'usd',
        name: 'US Dollar',
        symbol: '$',
        code: 'USD',
        icon: '/img/flags/us.png',
        exchangeRate: 1.0,
    },
    {
        id: 'eur',
        name: 'Euro',
        symbol: '€',
        code: 'EUR',
        icon: '/img/flags/eu.png',
        exchangeRate: 0.85,
    },
    {
        id: 'gbp',
        name: 'British Pound',
        symbol: '£',
        code: 'GBP',
        icon: '/img/flags/gb.png',
        exchangeRate: 0.73,
    },
    {
        id: 'jpy',
        name: 'Japanese Yen',
        symbol: '¥',
        code: 'JPY',
        icon: '/img/flags/jp.png',
        exchangeRate: 110.0,
    },
    {
        id: 'cad',
        name: 'Canadian Dollar',
        symbol: 'C$',
        code: 'CAD',
        icon: '/img/flags/ca.png',
        exchangeRate: 1.25,
    },
    {
        id: 'aud',
        name: 'Australian Dollar',
        symbol: 'A$',
        code: 'AUD',
        icon: '/img/flags/au.png',
        exchangeRate: 1.35,
    },
    {
        id: 'chf',
        name: 'Swiss Franc',
        symbol: '₣',
        code: 'CHF',
        icon: '/img/flags/ch.png',
        exchangeRate: 0.92,
    },
    {
        id: 'cny',
        name: 'Chinese Yuan',
        symbol: '¥',
        code: 'CNY',
        icon: '/img/flags/cn.png',
        exchangeRate: 6.45,
    },
]

export const getFiatCurrencies = () => {
    return fiatCurrencies
}

export const getFiatCurrency = (code: string) => {
    return fiatCurrencies.find((currency) => currency.code === code)
}
