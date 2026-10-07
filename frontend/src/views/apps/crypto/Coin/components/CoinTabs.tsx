import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import ReactHtmlParser from 'html-react-parser'

import type { CoinDetails, NewsArticle } from '../types'

type NewsCardProps = {
    article: NewsArticle
    onClick: (url: string) => void
}

const NewsCard = ({ article, onClick }: NewsCardProps) => {
    const handleClick = () => {
        onClick(article.url)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    return (
        <Card
            className="hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer transition-colors"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Read article: ${article.title}`}
        >
            <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                    <h6 className="font-semibold mb-2 line-clamp-2">
                        {article.title}
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">{article.source}</span>
                        <span>•</span>
                        <span>
                            {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                            {new Date(article.publishedAt).toLocaleTimeString(
                                [],
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                },
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

type IntroductionTabProps = {
    coinDetails: CoinDetails
}

const IntroductionTab = ({ coinDetails }: IntroductionTabProps) => {
    return (
        <div className="prose text-sm prose-p:text-sm prose-p:leading-normal prose-p:my-2 max-w-max">
            {ReactHtmlParser(coinDetails.description || '')}
        </div>
    )
}

type FeedTabProps = {
    newsArticles: NewsArticle[]
    isLoading: boolean
    error?: Error | null
    onArticleClick: (url: string) => void
}

const FeedTab = ({ newsArticles, onArticleClick }: FeedTabProps) => {
    return (
        <div className="space-y-4">
            {newsArticles.map((article) => (
                <NewsCard
                    key={article.id}
                    article={article}
                    onClick={onArticleClick}
                />
            ))}
        </div>
    )
}

type CoinTabsProps = {
    coinDetails: CoinDetails
    newsArticles: NewsArticle[]
    isLoadingNews: boolean
    newsError?: Error | null
    activeTab: 'introduction' | 'feed'
    onTabChange: (tab: 'introduction' | 'feed') => void
}

const CoinTabs = ({
    coinDetails,
    newsArticles,
    isLoadingNews,
    newsError,
    activeTab,
    onTabChange,
}: CoinTabsProps) => {
    const handleArticleClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    return (
        <div id="coin-details">
            <Tabs
                value={activeTab}
                onChange={(value) =>
                    onTabChange(value as 'introduction' | 'feed')
                }
                variant="underline"
            >
                <Tabs.TabList className="mb-6">
                    <Tabs.TabNav value="introduction">
                        <span className="flex items-center gap-2">
                            Introduction
                        </span>
                    </Tabs.TabNav>
                    <Tabs.TabNav value="feed">
                        <span className="flex items-center gap-2">
                            News Feed
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                {newsArticles.length}
                            </span>
                        </span>
                    </Tabs.TabNav>
                </Tabs.TabList>

                <Tabs.TabContent value="introduction">
                    <IntroductionTab coinDetails={coinDetails} />
                </Tabs.TabContent>

                <Tabs.TabContent value="feed">
                    <FeedTab
                        newsArticles={newsArticles}
                        isLoading={isLoadingNews}
                        error={newsError}
                        onArticleClick={handleArticleClick}
                    />
                </Tabs.TabContent>
            </Tabs>
        </div>
    )
}

export default CoinTabs
