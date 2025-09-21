'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

/**
 * 개발자 전용 테스트 페이지
 * - Sui 블록체인과의 상호작용을 테스트하기 위한 페이지
 * - Move 컨트랙트 함수들을 직접 호출하고 결과를 확인할 수 있음
 * - 개발 및 디버깅 목적으로만 사용
 */
export default function DevPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [contractAddress, setContractAddress] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [functionArgs, setFunctionArgs] = useState('');

  // 로그 추가 함수
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Balance Manager 생성 테스트
  const testCreateBalanceManager = async () => {
    setIsLoading(true);
    addLog('Balance Manager 생성 시작...');
    
    try {
      // 실제 Sui 트랜잭션 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      addLog(`✅ Balance Manager 생성 완료: ${mockTxHash}`);
      addLog('📊 새로운 Balance Manager 객체가 생성되었습니다.');
    } catch (error) {
      addLog(`❌ 오류 발생: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // USDC 예금 및 Trade Cap 위임 테스트
  const testDepositAndDelegate = async () => {
    setIsLoading(true);
    addLog('USDC 예금 및 Trade Cap 위임 시작...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAmount = 1000;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      addLog(`💰 ${mockAmount} USDC 예금 완료`);
      addLog(`🔑 Trade Cap 위임 완료: ${mockTxHash}`);
      addLog('✅ 거래 권한이 플랫폼에 위임되었습니다.');
    } catch (error) {
      addLog(`❌ 오류 발생: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 플랫폼 거래 실행 테스트
  const testPlatformTrading = async () => {
    setIsLoading(true);
    addLog('플랫폼 거래 실행 시작...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockPrice = 43500;
      const mockAmount = 0.0023;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      addLog(`📈 DeepBook에서 BTC 구매 실행`);
      addLog(`💱 구매가격: $${mockPrice.toLocaleString()}`);
      addLog(`🪙 구매수량: ${mockAmount} BTC`);
      addLog(`✅ 거래 완료: ${mockTxHash}`);
    } catch (error) {
      addLog(`❌ 오류 발생: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 커스텀 컨트랙트 함수 호출
  const testCustomFunction = async () => {
    if (!contractAddress || !functionName) {
      addLog('❌ 컨트랙트 주소와 함수명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    addLog(`커스텀 함수 호출: ${contractAddress}::${functionName}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      addLog(`✅ 함수 호출 완료: ${mockTxHash}`);
      addLog(`📝 인자: ${functionArgs || '없음'}`);
    } catch (error) {
      addLog(`❌ 오류 발생: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그 초기화
  const clearLogs = () => {
    setResults([]);
    addLog('로그가 초기화되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛠️ 개발자 테스트 페이지</h1>
          <p className="text-gray-600 mt-2">
            Sui 블록체인과 Move 컨트랙트 상호작용을 테스트하는 페이지입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 테스트 기능들 */}
          <div className="space-y-6">
            {/* 기본 Move 컨트랙트 테스트 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🏗️ Move 컨트랙트 기본 기능 테스트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={testCreateBalanceManager}
                    disabled={isLoading}
                    className="justify-start"
                  >
                    1️⃣ Balance Manager 생성
                  </Button>
                  <Button 
                    onClick={testDepositAndDelegate}
                    disabled={isLoading}
                    variant="secondary"
                    className="justify-start"
                  >
                    2️⃣ USDC 예금 & Trade Cap 위임
                  </Button>
                  <Button 
                    onClick={testPlatformTrading}
                    disabled={isLoading}
                    variant="outline"
                    className="justify-start"
                  >
                    3️⃣ 플랫폼 거래 실행
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p><strong>참고:</strong></p>
                  <ul className="mt-1 space-y-1">
                    <li>• 1단계: 사용자별 잔액 관리자 객체 생성</li>
                    <li>• 2단계: USDC 예금 후 거래 권한을 플랫폼에 위임</li>
                    <li>• 3단계: DeepBook을 통한 자동 BTC 구매 실행</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 커스텀 컨트랙트 호출 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚙️ 커스텀 컨트랙트 함수 호출</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      컨트랙트 주소
                    </label>
                    <input
                      type="text"
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      함수명
                    </label>
                    <input
                      type="text"
                      value={functionName}
                      onChange={(e) => setFunctionName(e.target.value)}
                      placeholder="function_name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      함수 인자 (JSON 형식)
                    </label>
                    <textarea
                      value={functionArgs}
                      onChange={(e) => setFunctionArgs(e.target.value)}
                      placeholder='["arg1", 123, true]'
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={testCustomFunction}
                  disabled={isLoading}
                  className="w-full"
                >
                  🚀 함수 실행
                </Button>
              </CardContent>
            </Card>

            {/* 유틸리티 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔧 유틸리티</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={clearLogs}
                  variant="destructive"
                  size="sm"
                >
                  🗑️ 로그 초기화
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 실행 결과 로그 */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  📋 실행 로그
                  {isLoading && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span>실행 중...</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="text-gray-500">
                      테스트 함수를 실행하면 여기에 결과가 표시됩니다...
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {results.map((result, index) => (
                        <div key={index} className="break-words">
                          {result}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단 경고 메시지 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <h3 className="font-medium text-yellow-800">개발자 전용 페이지</h3>
              <p className="text-sm text-yellow-700 mt-1">
                이 페이지는 개발 및 테스트 목적으로만 사용됩니다. 
                실제 프로덕션 환경에서는 사용하지 마세요. 
                모든 트랜잭션은 시뮬레이션이며 실제 블록체인에 영향을 주지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
