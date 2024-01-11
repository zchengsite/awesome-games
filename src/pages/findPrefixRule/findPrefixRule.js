/**
 * https://developers.weixin.qq.com/miniprogram/introduction/qrcode.html#%E5%8A%9F%E8%83%BD%E4%BB%8B%E7%BB%8D
 * 输入开始数字、结束数字，找到这串数字的前缀占用规则
 * 1、依据输入的开始/结束数字，生成连续的序列sequence。(start: 100, end: 1000 ) => [100, 101, 102, 103, ..., 1000]
 * 2、遍历序列sequence，截取每一位数字的最后一位与前几位生成新的数据结构cutLast。[{num: 10, last: 0}, {num: 10, last: 1}, ..., {num: 100, last: 0}]
 * 3、归纳分组cutLast，依据每一项中num属性值相同项进行分组，生成新的二维数组groupArr。[[{num: 10, last: 0}, {num: 10, last: 1}, {num: 10, last: 2}], [{ num: 100, last: 0 }, ..., { num: 100, last: 9 }]]
 * 4、遍历二维码数组groupArr，找出符合“每一项中最后一项last减去第一项last等于9”条件的num，标识上“可继续优化数据optimizedData”标识，其他不符合条件的项目暂存在finalData中。
 * 5、以optimizedData作为数据源，重复2～4步骤，直至optimizedData为空，得到最终数据finalData
 */
const start = document.querySelector('#start')
const end = document.querySelector('#end')
 
const executeBtn = document.querySelector('#executeBtn')
const resultTxt = document.querySelector('#resultTxt')

/**
 * @param {*} start 开始数字
 * @param {*} end 结束数字
 */
class FindPrefixRule {
  constructor(start, end) {
    this.start = start
    this.end = end
    this.finalData = []
    const sequence = this.sequenceGen()
    this.executeFn(sequence)
  }
  executeFn(sequence) {
    const groupArr = this.cutGroupSequence(sequence)
    const optimizedData = this.optimizing(groupArr)
    if (optimizedData.length) {
      this.executeFn(optimizedData)
    } else {
      console.log('finalData', this.finalData)
      resultTxt.innerHTML = this.finalData.join('<br />')
    }
  }

  // 1、生成连续的序列sequence
  sequenceGen() {
    const sequence = []
    while (this.start < this.end) {
      sequence.push(this.start)
      this.start++
    }
    sequence.push(this.end)
    return sequence
  }
  // 2、遍历序列sequence，截取每一位数字的最后一位与前几位生成新的数据结构cutLast
  // 3、归纳分组cutLast，依据每一项中num属性值相同项进行分组，生成新的二维数组groupArr
  cutGroupSequence(sequence) {
    const cutLast = (sequence || []).map(i => {
      const strI = String(i)
      const exceptLastStr = strI.substring(0, strI.length - 1)
      const lastStr = strI[strI.length - 1]
      return {
        num: exceptLastStr,
        last: lastStr
      }
    })
    const groupBy = (array, f) => {
      let groups = {}
      array.forEach((o) => {
        let group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map((group) => {
        return groups[group]
      })
    }
    const groupArr = groupBy(cutLast, (item) => {
      return item.num // 返回需要分组的对象
    })
    return groupArr
  }
  // 4、优化数据
  optimizing(groupArr) {
    let optimizedData = (groupArr || []).map(i => {
      // 符合“每一项中最后一项last减去第一项last等于9”条件的，即为可继续优化对象
      // 不符合即为目标对象，存入finalData中
      const isLastDiffEq9 = (i[i.length - 1] && i[i.length - 1].last || 0) - (i[0] && i[0].last || 0) === 9
      if (!isLastDiffEq9) {
        i.forEach(j => {
          const fullNum = j.num + j.last
          !this.finalData.includes(fullNum) && this.finalData.push(fullNum)
        })
        return null
      }
      return i[0].num
    })
    return (optimizedData || []).filter(i => i).map(i => Number(i))
  }
}

executeBtn.addEventListener('click', () => {
  const startNum = Number(start.value)
  const endNum = Number(end.value)
  if (!startNum || !Number(endNum)) {
    alert('请输入开始/结束数字')
    return
  }
  if (startNum > endNum) {
    alert('开始数字必须小于结束数字，请修改后重新输入')
    return
  }
  console.log('开始数字', startNum)
  console.log('结束数字', endNum)
  new FindPrefixRule(startNum, endNum)
}, false)
