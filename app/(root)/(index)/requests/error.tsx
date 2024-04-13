'use client'

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
  return (

    <section>
      <div className="px-8 py-24 mx-auto md:px-12 lg:px-32 max-w-7xl">
        <div className="text-center">
          <div>
            <span>
              <AnimationLottie animationPath={AnimationError} width={300} />
            </span>
            <p className="mt-8 text-4xl font-semibold tracking-tighter text-black text-balance">
              Oops! Something went wrong
            </p>
            <p className="mx-auto mt-4 text-sm font-medium text-gray-500 text-balance">
              {error.message}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mx-auto mt-8 md:flex-row">
            <Button onClick={() => reset()} className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium duration-200 bg-gray-100 md:w-auto rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Secondary action">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </section>

  )
}