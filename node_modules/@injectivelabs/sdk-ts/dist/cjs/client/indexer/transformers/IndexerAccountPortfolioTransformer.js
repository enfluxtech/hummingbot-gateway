"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexerGrpcAccountPortfolioTransformer = void 0;
class IndexerGrpcAccountPortfolioTransformer {
    static accountPortfolioResponseToAccountPortfolio(response, address) {
        const portfolio = response.portfolio;
        const bankBalancesList = (portfolio === null || portfolio === void 0 ? void 0 : portfolio.bankBalances) || [];
        const subaccountList = (portfolio === null || portfolio === void 0 ? void 0 : portfolio.subaccounts) || [];
        const positionsWithUpnlList = (portfolio === null || portfolio === void 0 ? void 0 : portfolio.positionsWithUpnl) || [];
        if (!portfolio) {
            return {
                accountAddress: address || '',
                bankBalancesList: [],
                subaccountsList: [],
                positionsWithUpnlList: [],
            };
        }
        return {
            accountAddress: portfolio.accountAddress,
            bankBalancesList: bankBalancesList.map(IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin),
            subaccountsList: subaccountList.map(IndexerGrpcAccountPortfolioTransformer.grpcSubaccountBalanceToSubaccountBalance),
            positionsWithUpnlList: positionsWithUpnlList.map(IndexerGrpcAccountPortfolioTransformer.grpcPositionWithUPNLToPositionWithUPNL),
        };
    }
    static grpcCoinToCoin(coin) {
        return {
            amount: coin.amount,
            denom: coin.denom,
        };
    }
    static grpcPositionWithUPNLToPositionWithUPNL(positionsWithUPNL) {
        const grpcPosition = positionsWithUPNL.position;
        return {
            position: grpcPosition
                ? IndexerGrpcAccountPortfolioTransformer.grpcPositionToGrpcPosition(grpcPosition)
                : undefined,
            unrealizedPnl: positionsWithUPNL.unrealizedPnl,
        };
    }
    static grpcPositionToGrpcPosition(position) {
        return {
            ticker: position.ticker,
            marketId: position.marketId,
            subaccountId: position.subaccountId,
            direction: position.direction,
            quantity: position.quantity,
            entryPrice: position.entryPrice,
            margin: position.margin,
            liquidationPrice: position.liquidationPrice,
            markPrice: position.markPrice,
            aggregateReduceOnlyQuantity: position.aggregateReduceOnlyQuantity,
            updatedAt: parseInt(position.updatedAt, 10),
            createdAt: parseInt(position.createdAt, 10),
        };
    }
    static grpcSubaccountDepositToSubaccountDeposit(subaccountDeposit) {
        return {
            totalBalance: subaccountDeposit.totalBalance,
            availableBalance: subaccountDeposit.availableBalance,
        };
    }
    static grpcSubaccountBalanceToSubaccountBalance(subaccountBalance) {
        const deposit = subaccountBalance.deposit;
        return {
            subaccountId: subaccountBalance.subaccountId,
            denom: subaccountBalance.denom,
            deposit: deposit
                ? IndexerGrpcAccountPortfolioTransformer.grpcSubaccountDepositToSubaccountDeposit(deposit)
                : undefined,
        };
    }
}
exports.IndexerGrpcAccountPortfolioTransformer = IndexerGrpcAccountPortfolioTransformer;
//# sourceMappingURL=IndexerAccountPortfolioTransformer.js.map