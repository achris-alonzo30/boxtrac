'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AnimationError from "@/public/animation-error.json"
import { AnimationLottie } from "@/components/animation-lottie"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center px-8 py-24 mx-auto max-w-7xl">
        <div className="text-center">
          <div className="flex flex-col items-center">
            <AnimationLottie animationPath={AnimationError} />
            <p className="mt-4 text-lg font-medium text-gray-300 text-center">
              Oops! Something went wrong. Please try again.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-8 md:flex-row">
            <Button variant="ghost" onClick={() => router.back()} className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium duration-200 md:w-auto rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Secondary action">
              Back
            </Button>
            <Button onClick={() => reset()} className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium duration-200 bg-gray-100 md:w-auto rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Secondary action">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}