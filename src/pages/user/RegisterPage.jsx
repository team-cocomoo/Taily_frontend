import React from "react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-lg border border-zinc-800">
        <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>
        
        <form className="space-y-4">
          <div className="flex space-x-2">
            <input type="text" placeholder="이름" className="w-1/2 bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
            <input type="text" placeholder="닉네임" className="w-1/2 bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
          </div>
          <div className="flex space-x-2">
            <input type="email" placeholder="이메일" className="w-1/2 bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
            <input type="text" placeholder="전화번호" className="w-1/2 bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
          </div>
          <input type="text" placeholder="아이디" className="w-full bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
          <input type="password" placeholder="비밀번호" className="w-full bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
          <input type="password" placeholder="비밀번호 확인" className="w-full bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
          <div className="flex space-x-2">
            <input type="text" placeholder="주소" className="w-2/3 bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
            <input type="text" placeholder="상세주소" className="w-1/3 bg-transparent border border-yellow-500 rounded-full px-4 py-2 focus:outline-none" />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-full transition"
          >
            완료
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
