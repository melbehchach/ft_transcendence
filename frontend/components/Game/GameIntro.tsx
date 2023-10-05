import Image from 'next/image'

export default function GameIntro() {
	return (
		<>
			<div className="w-screen h-screen flex justify-center bg-background">
				<div className='flex flex-row-reverse items-center'>
					<div>
						<Image
							src="/img/GameIntro.png"
							width={540}
							height={525}
							alt="pong" />
					</div>
					<div className='flex flex-col items-start'>
						<h1 className="text-white text-6xl font-sans font-bold">READY TO PONG?</h1>
						<span className="text-sm font-lessbold text-textSecondary">
							You can challenge your friends or play against random opponents online. Let’s go!
						</span>
						<div className='w-fit flex justify-around pt-10 border border-red-500'>
							<div className='w-4/12 flex flex-col items-center gap-3'>
								<Image
									src="/img/ChallengeFriends.png"
									width={200}
									height={200}
									alt="play" />
								<h1 className='text-white text-2xl font-sans font-bold'>Challenge friends online</h1>
								<span className='text-textSecondary text-xs'>challenge your online friends for a 1v1 pong party</span>
								<button className="w-full bg-primary text-text px-6 py-3 rounded-3xl text-xs text-center">Challenge your friends</button>
							</div>
							<div className='w-4/12 flex flex-col items-center gap-3'>
								<Image
									src="/img/FindRandomOpponent.png"
									width={200}
									height={200}
									alt="play" />
								<h1 className='text-white text-2xl font-sans font-bold'>Find a random opponents</h1>
								<span className='text-textSecondary text-xs'>Let us find you a random opponent online</span>
								<button className="w-full bg-primary text-text px-6 py-3 rounded-3xl text-xs text-center">Find opponent</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}



