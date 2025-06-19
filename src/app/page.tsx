import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Test Case</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-blue-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/quotes" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Quotes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">Manual Test Case <span className="text-base font-normal text-gray-500">(ทุกหน้า)</span></h1>

        {/* Login Page */}
        <section className="mb-10 bg-white rounded-xl shadow p-7 border">
          <h2 className="text-xl font-semibold mb-3 text-blue-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
            หน้า Login (&quot;/login&quot;)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <b>Login สำเร็จ</b><br />
              <span className="text-sm text-gray-500">กรอกอีเมล/รหัสผ่านถูกต้อง กด Sign in แล้วเข้าสู่ Dashboard</span>
            </li>
            <li>
              <b>Login ไม่สำเร็จ (รหัสผิด)</b><br />
              <span className="text-sm text-gray-500">กรอกข้อมูลผิด ระบบแจ้งเตือน</span>
            </li>
            <li>
              <b>แสดงลิงก์ไป Register</b><br />
              <span className="text-sm text-gray-500">มีลิงก์ &quot;create a new account&quot; ไปหน้า Register</span>
            </li>
            <li>
              <b>ปุ่ม Sign in แสดงสถานะ Loading</b><br />
              <span className="text-sm text-gray-500">ขณะกำลัง Login ปุ่มเปลี่ยนเป็น &quot;Signing in...&quot; และกดซ้ำไม่ได้</span>
            </li>
          </ol>
        </section>
        <div className="border-t my-8" />

        {/* Register Page */}
        <section className="mb-10 bg-white rounded-xl shadow p-7 border">
          <h2 className="text-xl font-semibold mb-3 text-blue-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
            หน้า Register (&quot;/register&quot;)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <b>สมัครสมาชิกสำเร็จ</b><br />
              <span className="text-sm text-gray-500">กรอกข้อมูลครบ กด Create account แล้วเข้าสู่ Dashboard</span>
            </li>
            <li>
              <b>รหัสผ่านไม่ตรงกัน</b><br />
              <span className="text-sm text-gray-500">กรอก Password กับ Confirm Password ไม่ตรง ระบบแจ้งเตือน</span>
            </li>
            <li>
              <b>รหัสผ่านสั้นเกินไป</b><br />
              <span className="text-sm text-gray-500">รหัสผ่านน้อยกว่า 6 ตัว ระบบแจ้งเตือน</span>
            </li>
            <li>
              <b>สมัครสมาชิกซ้ำ (อีเมลซ้ำ)</b><br />
              <span className="text-sm text-gray-500">ใช้อีเมลที่เคยสมัคร ระบบแจ้งเตือน</span>
            </li>
            <li>
              <b>แสดงลิงก์ไป Login</b><br />
              <span className="text-sm text-gray-500">มีลิงก์ &quot;sign in to your existing account&quot; ไปหน้า Login</span>
            </li>
            <li>
              <b>ปุ่ม Create account แสดงสถานะ Loading</b><br />
              <span className="text-sm text-gray-500">ขณะสมัครสมาชิก ปุ่มเปลี่ยนเป็น &quot;Creating account...&quot; และกดซ้ำไม่ได้</span>
            </li>
          </ol>
        </section>
        <div className="border-t my-8" />

        {/* Dashboard Page */}
        <section className="mb-10 bg-white rounded-xl shadow p-7 border">
          <h2 className="text-xl font-semibold mb-3 text-blue-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
            หน้า Dashboard (&quot;/dashboard&quot;)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <b>แสดงกราฟ Top 10 Quotes by Votes</b><br />
              <span className="text-sm text-gray-500">ควรเห็นกราฟแท่งแสดง Quote ที่มีคะแนนโหวตสูงสุด 10 อันดับ</span>
            </li>
            <li>
              <b>แสดงสถิติรวม</b><br />
              <span className="text-sm text-gray-500">เช่น จำนวน Quotes ทั้งหมด, จำนวนโหวตรวม, จำนวน Quotes ที่ user สร้าง</span>
            </li>
            <li>
              <b>แสดง Recent Quotes</b><br />
              <span className="text-sm text-gray-500">ควรเห็นรายการ Quotes ล่าสุด</span>
            </li>
            <li>
              <b>ปุ่ม Logout</b><br />
              <span className="text-sm text-gray-500">กดแล้วออกจากระบบและไปหน้า Login</span>
            </li>
            <li>
              <b>ปุ่ม Add/View Quotes</b><br />
              <span className="text-sm text-gray-500">กดแล้วไปหน้า Quotes</span>
            </li>
            <li>
              <b>เข้าถึง Dashboard โดยไม่ Login</b><br />
              <span className="text-sm text-gray-500">ถ้าไม่ Login ระบบควร redirect ไปหน้า Login</span>
            </li>
          </ol>
        </section>
        <div className="border-t my-8" />

        {/* Quotes Page */}
        <section className="mb-10 bg-white rounded-xl shadow p-7 border">
          <h2 className="text-xl font-semibold mb-3 text-blue-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
            หน้า Quotes (&quot;/quotes&quot;)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <b>แสดงรายการ Quotes ทั้งหมด</b><br />
              <span className="text-sm text-gray-500">ควรเห็น Quotes ทั้งหมดในระบบ</span>
            </li>
            <li>
              <b>ค้นหา Quote</b><br />
              <span className="text-sm text-gray-500">กรอกคำค้นหาแล้วแสดงผลลัพธ์ที่ตรง</span>
            </li>
            <li>
              <b>Sort Quotes</b><br />
              <span className="text-sm text-gray-500">เลือก Sort (Votes, Author, Date) แล้วลำดับเปลี่ยน</span>
            </li>
            <li>
              <b>โหวต Quote</b><br />
              <span className="text-sm text-gray-500">กดโหวตใน Quote ที่ต้องการ คะแนนเพิ่มขึ้น</span>
            </li>
            <li>
              <b>โหวตซ้ำไม่ได้</b><br />
              <span className="text-sm text-gray-500">Quote ที่โหวตแล้วจะกดซ้ำไม่ได้</span>
            </li>
            <li>
              <b>เพิ่ม Quote ใหม่</b><br />
              <span className="text-sm text-gray-500">กด Add Quote กรอกข้อมูลแล้ว Quote ใหม่แสดงในรายการ</span>
            </li>
            <li>
              <b>แก้ไข Quote ของตัวเอง</b><br />
              <span className="text-sm text-gray-500">Quote ที่สร้างเองสามารถแก้ไขได้</span>
            </li>
            <li>
              <b>Load More Quotes</b><br />
              <span className="text-sm text-gray-500">กด Load More แล้วแสดง Quote เพิ่ม</span>
            </li>
            <li>
              <b>ปุ่ม Logout</b><br />
              <span className="text-sm text-gray-500">กดแล้วออกจากระบบและไปหน้า Login</span>
            </li>
            <li>
              <b>เข้าถึง Quotes โดยไม่ Login</b><br />
              <span className="text-sm text-gray-500">ถ้าไม่ Login ระบบควร redirect ไปหน้า Login</span>
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
