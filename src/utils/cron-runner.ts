import { CronJob } from 'cron'

export type CronRunOptions = {
    repository: any
    logger: string
}

type CronConfig = {
    id: string
    cron: string
    execute: () => void
}

export const makeCronRunner = (
    config: CronConfig[]
) => {

    const executeIfFirst = async (id: string, execute: () => void) => {
        await execute()
    }

    const crons = config.map(
        ({ id, cron, execute }) => (
            new CronJob(
                cron,
                () => executeIfFirst(id, execute),
                undefined,
                true
            )
        )
    )


    return () => {
        for (const cron of crons) {
            console.log('close cron')
            cron.stop()
        }
    }
}